const express = require("express");

const router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utlis/validators/categoryValidator");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} = require("../controllers/category.controller");
const {
 protect,
 allowedTo
  } = require('../controllers/auth.controller');




const subCategoryRoutes =require('./subCategory.route')
// get subcategories belong to specific category

router.use("/:categoryId/subcategories",subCategoryRoutes)


router
  .route("/")
  .get(getAllCategories)
  .post(protect,allowedTo("admin","manager"),uploadCategoryImage,resizeImage,createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(protect,allowedTo("admin","manager"),uploadCategoryImage,resizeImage,updateCategoryValidator, updateCategory)
  .delete(protect,allowedTo("admin"),deleteCategoryValidator, deleteCategory);

module.exports = router;
