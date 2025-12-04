const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    require: [true, 'Please provide rating number'],
  },
  title: {
    type: String,
    trim: true,
    require: [true, 'Please provide title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    require: [true, 'Please provide review text'],
  },  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: [true, 'Please provide user id'],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    require: [true, 'Please provide product id'],
  },
}, { timestamps: true });

// ensures only one review per product each user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId
      }
    }, {
      $group: {
        _id: '$product', 
        averageRating: {
          $avg: '$rating'
        }, 
        numOfReviews: {
          $sum: 1
        }
      }
    }
  ])

  console.log(result);

  // we can now update the product fields 
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId }, 
      { 
        // if no review has been found, it will be 0
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      },
    )
  } catch (error) {
    console.log(error);
  }
  
};

ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema); 