const Review = require('../models/Review');
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');
const CustomError = require('../errors');


const createOrder = async (req, res) => {
  
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
