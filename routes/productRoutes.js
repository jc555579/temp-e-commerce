const express = require('express');
const router = express.Router();

// controller
const {  createProduct, getAllProducts, 
  getSingleProduct, updateProduct, 
  deleteProduct, uploadImage } = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');

// middleware
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

// getAllProducts and getSingleProduct are public
router.route('/')
  .get(authenticateUser, getAllProducts)
  .post(authenticateUser, authorizePermissions('admin'), createProduct);

router.route('/:id')
  .get(authenticateUser, getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

router.route('/uploadImage').post(authenticateUser, uploadImage);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;