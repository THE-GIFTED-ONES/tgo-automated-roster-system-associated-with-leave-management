const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //Remove password from output when user is created
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    emp_name: req.body.emp_name,
    emp_email: req.body.emp_email,
    empID: req.body.empID,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { empID, password } = req.body;

  // 1)Check if empID and Password exist
  if (!empID || !password) {
    return next(new AppError('Please provide empID and password', 400));
  }

  // 2)Check if user exists && password is correct
  const user = await User.findOne({ empID }).select('+password');
  //selecting password field because it is not selected by default.In User model, we have set select:false for password field

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect empID or password', 401));
  }

  // 3)If everything is ok, send token to client
  createSendToken(user, 200, res);
  console.log('Logged In');
});

//?Implementing Protected Routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and Check it is available
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //Splitting header into two parts and taking second part which is token. It is an Array
  }

  // Check Whether User is login or Not
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //promisify is used to convert callback function to promise

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  //decoded.id is the id of the user who is logged in.In this case the payload is {id: user._id, iat: timestamp}

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }
  // 4) Check if user changed password after the token was issued.
  if (currentUser.changedPasswordafter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  // 5) GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  //Needed for next features.
  req.saveduser = req.user;
  next();
});

//?Restricting Users
exports.restrictTo =
  (...jobTitle) =>
  (req, res, next) => {
    //JobTitle is an array
    if (!jobTitle.includes(req.user.jobTitle)) {
      return next(
        new AppError('You do not have permission to this action', 403)
      );
    }
    next();
  };

//? Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  //2) Generate the random Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.emp_email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //req.params.token is the token which is sent in the url

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  //3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //User.findByIdAndUpdate will not work as intended!
  //!Why?
  //?Because middleware is not run when we use findByIdAndUpdate and validate function does not run on update. only works in CREATE and SAVE.

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
