const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    unique: true,
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

// This is a middleware that hash the password before saving the file
UserSchema.pre('save', async function() {
  // Generate salt, then hash it.
  const salt = await bcrypt.genSalt(10); // 10 rounds
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
}

module.exports = mongoose.model('users', UserSchema);
