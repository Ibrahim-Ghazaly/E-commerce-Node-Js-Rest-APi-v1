/* eslint-disable no-use-before-define */

const ApiError = require("../utlis/apiError");

const handleJwtInvalidSignature = ()=> new ApiError('Invalid Token, please login again..',401);
const handleJwtExpired = ()=> new ApiError('Expired Token ,please login again..',401);


const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(res, error);
  } else {
    if(error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if(error.name === "TokenExpiredError") error = handleJwtExpired();

    sendErrorForProd(res, error);
  }
};

const sendErrorForDev = (res, error) =>
  res.status(error.statusCode).json({
    staus: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });

const sendErrorForProd = (res, error) =>
  res.status(error.statusCode).json({
    staus: error.status,
    message: error.message,
  });

module.exports = globalError;
