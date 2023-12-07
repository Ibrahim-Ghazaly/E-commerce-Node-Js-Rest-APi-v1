const express = require('express');

const {

getLoggedUserCart,
addProductsToCart,
removeSpecificCartItem,
clearCart,
updateCartItemQuantity,
applyCoupon

} = require('../controllers/cart.controller');

const {
    protect,
    allowedTo
     } = require('../controllers/auth.controller');
     
const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addProductsToCart).get(getLoggedUserCart).delete(clearCart);
router.put('/applyCoupon', applyCoupon);
router.route('/:id').put(updateCartItemQuantity).delete(removeSpecificCartItem);
module.exports = router;