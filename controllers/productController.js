const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });  
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.deleteOne();

  res.status(StatusCodes.OK).json({'msg': 'Success! Product Removed.'});
};

const uploadImage = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  // Gets the image
  const productImage = req.files.image;

  // check format
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  // maximum size of the image
  const maxSize = 1024 * 1024;

  // checks if the image size is bigger
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please upload image smaller than 1MB');
  }

  // this is the server’s local file path where the image will be saved
  const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);

  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct, getAllProducts,
  getSingleProduct, updateProduct, 
  deleteProduct, uploadImage
};