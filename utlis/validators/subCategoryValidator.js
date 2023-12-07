const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.getSubCategoryValidator = [
    // rules 
    check('id').isMongoId().withMessage('Invalid subcategory id format'),
    // middleware 
    validatorMiddleware,
  ];

  exports.createSubCategoryValidator = [
       // rules 
       check('name').notEmpty().withMessage('name is required')
       .isLength({min:2}).withMessage("too short subcategory name")
       .isLength({max:32}).withMessage("too long subcategory name")
       .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
       check('category').notEmpty().withMessage('category id is required').isMongoId().withMessage('Invalid category id format'),
       // middleware 
       validatorMiddleware,
  ]


  exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware,
  ];
  
  exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware,
  ];


