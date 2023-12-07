const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utlis/validators/productValidator');

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages
} = require('../controllers/product.controller');
const {
  protect,
  allowedTo
   } = require('../controllers/auth.controller');

 const reviewsRoute = require('./review.route');

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use('/:productId/reviews', reviewsRoute);



router.route('/').get(getAllProducts).post(protect,allowedTo("admin","manager"),uploadProductImages,resizeProductImages,createProductValidator, createProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(protect,allowedTo("admin","manager"), uploadProductImages,resizeProductImages,updateProductValidator, updateProduct)
  .delete(protect,allowedTo("admin"),deleteProductValidator, deleteProduct);

module.exports = router;