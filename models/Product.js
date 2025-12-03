const mongoose = require('mongoose');

// Only admin can use this model
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxLength: [100, 'Name cannot be more than 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxLength: [1000, 'Description cannot be more than 1000 characters'],
  },
  image: {
    type: String,
    default: '/uploads/example.jpeg',
  }, 
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['office', 'kitchen', 'bedroom'],
  },
  company: {
    type: String,
    required: [true, 'Please provide product company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported',
    }
  },
  colors: {
    type: [String],
    default: ['#222'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: [true, 'please provide product inventory'],
    default: 15,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true, toJSON: { virtuals: true, toObject: { virtuals: true } } }); 

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});


module.exports = mongoose.model('Product', ProductSchema);
