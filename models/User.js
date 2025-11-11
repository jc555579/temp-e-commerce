const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'please provide valid email' // if validator is returns false
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
    maxLength: 50
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
});

module.exports = mongoose.model('users', UserSchema);
