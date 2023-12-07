/* eslint-disable node/no-missing-require */
const express = require("express");


const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utlis/validators/subCategoryValidator");


const {
 createSubCategory,
 getAllSubCategories,
 getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj

} = require("../controllers/subCategory.controller");

const {
  protect,
  allowedTo
   } = require('../controllers/auth.controller');

// merge params allow us to access parameters on other routers
//ex:we need to access category id from category route

const router = express.Router({mergeParams:true});


router
  .route("/").get(createFilterObj,getAllSubCategories)
  .post(protect,allowedTo("admin","manager"),setCategoryIdToBody,createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(protect,allowedTo("admin","manager"),updateSubCategoryValidator, updateSubCategory)
  .delete(protect,allowedTo("admin"),deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
