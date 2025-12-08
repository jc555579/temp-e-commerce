const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');
const CustomError = require('../errors');
const Order = require('../models/Order');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';

  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  // cart items is provided by frontend (localStorage)
  const { items: cartItems, tax, shippingFee } = req.body;

  // Check whether there are any items in the cart
  // Make sure the tax, shipping fee is passed along
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('Please provide tax and shipping fee');
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id : ${ item.product }`);
    }

    // pull out the value in cart
    const { name, price, image, _id: product } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];

    // calculate subtotal
    subTotal += item.amount * price;
  }

  // calculate total
  const total = tax + shippingFee + subTotal;

  // get client secret (fake stripe)
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd'
  });

  // order
  const order = await Order.create({
    orderItems, total, subTotal, tax, shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId
  });

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret});
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.BadRequestError(`No order with id : ${orderId}`);
  }

  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.BadRequestError(`No order with id : ${orderId}`);
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';

  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
};
