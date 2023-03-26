class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    //const err= new Error(message); Message also used in the parent class constructor.So, we can use super(message) instead of const err= new Error(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
