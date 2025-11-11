const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
  res.send('register response');
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
