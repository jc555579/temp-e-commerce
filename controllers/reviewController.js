const Review = require('../models/Review');
const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const userId = req.user.userId;

  // it would makes sense if the product exist
  const productId = req.body.product;
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  // checks if the user already reviewed the product
  const alreadySubmitted = await Review.findOne({
    product: productId, user: userId
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError('Already submitted review for this product');
  }

  req.body.user = userId;

  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'name company price' });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);    
  }

  // checks if it is the right user to perform update
  checkPermissions(req.user, review.user);

  // update using assignment operation
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  // checks if it is the right user to perform delete
  checkPermissions(req.user, review.user);

  await review.deleteOne();

  res.status(StatusCodes.OK).json({'msg': 'Success! Review Removed.'})
};


module.exports = {
  createReview, getAllReviews, getSingleReview, 
  updateReview, deleteReview
};
