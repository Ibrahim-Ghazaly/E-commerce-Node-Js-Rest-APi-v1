const express = require('express');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utlis/validators/brandValidator');

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage

} = require('../controllers/brand.controller');
const {
  protect,
  allowedTo
   } = require('../controllers/auth.controller');

const router = express.Router();

router.route('/').get(getBrands).post( protect,allowedTo('admin', 'manager'),
uploadBrandImage,resizeImage,createBrandValidator, createBrand);
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(protect,allowedTo('admin', 'manager'),uploadBrandImage,resizeImage,updateBrandValidator, updateBrand)
  .delete(protect,allowedTo('admin'),deleteBrandValidator, deleteBrand);

module.exports = router;