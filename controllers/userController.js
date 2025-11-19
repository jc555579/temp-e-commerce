const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  
  const user = await User.findOne({ _id: userId }).select('-password');

  if (!user) {
    throw new CustomError.NotFoundError('No user with id: ' + userId);
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send('update user');
};

const updateUserPassword = async (req, res) => {
  // Get the values
  const { oldPassword, newPassword } = req.body;

  // checks if 
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide required fields');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Old password does not match with the current password');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password updated'});
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};