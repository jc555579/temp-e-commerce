const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    throw new CustomError.BadRequestError('Email already exists!');
  }

  // first registered user is an admin
  const isFirstAccount = await User.countDocuments({}) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, name, password, role });

  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED)
    .send({ user });
};

const login = async (req, res) => {
  res.send('login response');
};

const logout = async (req, res) => {
  res.send('logout response');
};

module.exports = {
  register,
  login, 
  logout
};
