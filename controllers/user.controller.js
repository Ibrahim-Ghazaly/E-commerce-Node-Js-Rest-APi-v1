/* eslint-disable import/no-extraneous-dependencies */
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const ApiError = require('../utlis/apiError');
const factory = require('./handlersFactory');
const User = require('../models/user.model');
const {uploadSingleImage} = require('../middlewares/uploadImgaeMiddleware');
const createToken = require('../utlis/createToken');



//upload a single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// image processing
exports.resizeImage =asyncHandler( async(req,res,next)=>{

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`

  // console.log(req.file)
  if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/users/${filename}`);
  
    // save image into Db 
    req.body.profileImg = filename;

  }

  next();
})

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser =  asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: req.body.slug,
    phone: req.body.phone,
    email: req.body.email,
    profileImg: req.body.profileImg,
    role: req.body.role
  }, {
    new: true,
  });

  if (!user) {
    return next(
      new ApiError(`No document for this id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });;
})

// @desc    change password
// @route   PUT /api/v1/users/:id
// @access  Private
exports.changeUserPassword =  asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    password:await  bcrypt.hash(req.body.password,12),
    passwordChangedAt:Date.now()
   
  }, {
    new: true,
  });

  if (!user) {
    return next(
      new ApiError(`No document for this id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });;
})
// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.delete(User)


// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;

  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});