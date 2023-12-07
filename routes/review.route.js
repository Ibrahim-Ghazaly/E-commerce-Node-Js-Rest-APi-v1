const express = require('express');
const {
  // getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  // deleteReviewValidator,
} = require('../utlis/validators/reviewValidator');

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody
} = require('../controllers/review.controller');
const {
    protect,
    allowedTo
     } = require('../controllers/auth.controller');

const router = express.Router({mergeParams:true});

router.route('/').get(createFilterObj,getReviews).post(protect,allowedTo("user"),setProductIdAndUserIdToBody,createReviewValidator,createReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect,allowedTo("user"),updateReviewValidator,updateReview)
  .delete(protect,allowedTo("user","admin","manager"),deleteReview);

module.exports = router;