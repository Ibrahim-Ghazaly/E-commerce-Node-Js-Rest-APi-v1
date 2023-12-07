const express = require('express');

const {
    protect,
    allowedTo
     } = require('../controllers/auth.controller');
const {
    createCashOrder,
    findAllOrders,
    findSpecificOrder,
    filterOrderForLoggedUser,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession
} = require('../controllers/order.controller');

const router = express.Router();

router.use(protect);

router.route('/:cartId').post(allowedTo('user'),createCashOrder);


router.get(
  '/checkout-session/:cartId',
   protect,
   allowedTo('user'),
  checkoutSession
);



router.get(
    '/',
    allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders
  );
  router.get('/:id', findSpecificOrder);


  router.put(
    '/:id/pay',
    allowedTo('admin', 'manager'),
    updateOrderToPaid
  );
  router.put(
    '/:id/deliver',
    allowedTo('admin', 'manager'),
    updateOrderToDelivered
  );
  

module.exports = router;