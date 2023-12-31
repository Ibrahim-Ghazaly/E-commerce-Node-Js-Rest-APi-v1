const express = require('express');

const {
    signupValidator,
    loginValidator
} = require('../utlis/validators/authValidator');

const {
signup,
login,
forgetPassword,
verifyPassResetCode,
resetPassword
} = require('../controllers/auth.controller');

const router = express.Router();





router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);


module.exports = router;