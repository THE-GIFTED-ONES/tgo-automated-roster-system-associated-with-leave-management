class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //super is used to call the parent class constructor.
    //const err= new Error(message); Message also used in the parent class constructor.So, we can use super(message) instead of const err= new Error(message);

    this.statusCode = statusCode; //this is used to access the current class properties
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //this is used to differentiate between operational and programming errors.
    Error.captureStackTrace(this, this.constructor); //Used to capture the stack trace of the error, console.log(err.stack)
  }
}

module.exports = AppError;
