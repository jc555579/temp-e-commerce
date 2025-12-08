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
  res.send('get all orders');
};

const getSingleOrder = async (req, res) => {
  res.send('get single order');
};

const getCurrentUserOrders = async (req, res) => {
  res.send('get current user orders');
};

const updateOrder = async (req, res) => {
  res.send('update order');
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
};
