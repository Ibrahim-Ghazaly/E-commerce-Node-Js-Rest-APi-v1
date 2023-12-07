const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.getCategoryValidator = [
    // rules 
    check('id').isMongoId().withMessage('Invalid category id format'),
    // middleware 
    validatorMiddleware,
  ];

  exports.createCategoryValidator = [
       // rules 
       check('name').notEmpty().withMessage('name is required')
       .isLength({min:3}).withMessage("too short category name")
       .isLength({max:32}).withMessage("too long category name") 
       .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
       // middleware 
       validatorMiddleware,
  ]


  exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
  ];
  
  exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
  ];


