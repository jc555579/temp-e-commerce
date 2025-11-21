const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createProduct = async (req, res) => {
  res.send('create product function');
};

const getAllProducts = async (req, res) => {
  res.send('get all products function');  
};

const getSingleProduct = async (req, res) => {
  res.send('get single product function');
};

const updateProduct = async (req, res) => {
  res.send('update product function');
};

const deleteProduct = async (req, res) => {
  res.send('delete product function');
};

const uploadImage = async (req, res) => {
  res.send('upload image function');
};

module.exports = {
  createProduct, getAllProducts,
  getSingleProduct, updateProduct, 
  deleteProduct, uploadImage
};