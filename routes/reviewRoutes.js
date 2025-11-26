const express = require('express');
const router = express.Router();

// controller
const { createReview, getAllReviews, getSingleReview, 
  updateReview, deleteReview } = require('../controllers/reviewController');

// middleware
const { authenticateUser } = require('../middleware/authentication');

// only getAllReviews and getSingleReview accessible to public
router.route('/')
  .get(getAllReviews)
  .post(authenticateUser, createReview);

router.route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)

  
module.exports = router;
