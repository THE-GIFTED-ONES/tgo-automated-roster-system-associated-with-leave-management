const AppError = require('../utils/appError');

//Handle CastError DB: Invalid ID
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//Handle Duplicate Fields DB: Duplicate Field
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//Handle Validation Error DB: Invalid Data
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//Handle JWT Error
const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

//Handle JWT Expired Error
const handleJWTExpiredError = () =>
  new AppError('Your session/Token has expired! Please login again.', 401);

//Error Handling: Development Stage
//? We need Much information about the error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//Error Handling: Production Stage
//? Minimum information about the error to client
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //?Programming or other unknown error: don't leak error details.

    //1) Log error: As programmers, we need to know what happened
    console.error('ERROR', err);

    //2) Send generic message
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Oops! Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //!process.env.NODE_ENV returns either 'development' or 'production' with + " " (Whitespaces). So we need to trim it. Only on windows environment

  if (process.env.NODE_ENV.trim() === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    //?We need to make a copy of the error object, because we are going to modify it
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }
    sendErrorProd(error, res);
  }
};
