const { enableExperimentalFragmentVariables } = require('graphql-tag');
const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational is a error that is handled by the code
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('🔴 ERROR 🔴', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please contact us',
    });
  }
};

const handleJWTInvalid = () => new AppError('Invalid token. Log in again', 401);
const handleJWTExpired = () =>
  new AppError('Your token has expired. Log in again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
    };

    if (err.name === 'JsonWebTokenError') error = handleJWTInvalid();
    if (err.name === 'TokenExpiredError') error = handleJWTExpired();

    sendErrorProd(error, res);
  }
};
