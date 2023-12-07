const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator
} = require('../utlis/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require('../controllers/user.controller');
const {
  protect,
  allowedTo
   } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/getMe',protect,getLoggedUserData,getUser);
router.put('/changeMyPassword',protect,updateLoggedUserPassword);
router.put('/updateMe',protect, updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe',protect,deleteLoggedUserData);





router.put('/changeUserPassword/:id',changeUserPasswordValidator,changeUserPassword);



router.route('/').get(protect,allowedTo("admin","manager"),getUsers).post(protect,allowedTo("admin"),uploadUserImage,resizeImage,createUserValidator, createUser);
router
  .route('/:id')
  .get(protect,allowedTo("admin"),getUserValidator, getUser)
  .put(protect,allowedTo("admin"),uploadUserImage,resizeImage,updateUserValidator, updateUser)
  .delete(protect,allowedTo("admin"),deleteUserValidator, deleteUser);

module.exports = router;