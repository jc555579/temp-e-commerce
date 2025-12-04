const mongoose = require('mongoose');

const SingleCartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,  
  }
});

const OrderSchema = new mongoose.Schema({
  tax: {
    type: Number,
    required: [true, 'Please provide tax'],
  },
  shippingFee: {
    type: Number,
    required: [true, 'Please provide shipping fee'],
  },
  subTotal: {
    type: Number,
    required: [true, 'Please provide sub total'],
  },
  total: {
    type: Number,
    required: [true, 'Please provide total'],
  },
  cartItems: [SingleCartItemSchema],
  status: {
    type: String,
    enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
    default: 'pending'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  clientSecret: {
    type: String,
    required: [true, 'Please provide client secret'],
  },
  paymentIntentId: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
