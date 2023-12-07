const express = require('express');

const {
    protect,
    allowedTo
     } = require('../controllers/auth.controller');
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../controllers/wishlist.controller');

const router = express.Router();

router.use(protect,allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);



router.delete('/:productId', removeProductFromWishlist);

module.exports = router;