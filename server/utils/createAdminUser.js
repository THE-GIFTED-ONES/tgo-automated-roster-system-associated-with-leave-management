const catchAsync = require('./catchAsync');
const User = require('../models/userModel');

exports.createAdminIfNoneExists = catchAsync(async (req, res, next) => {
  //01.) Check Whether Admin User Exists
  const adminUser = await User.findOne({ email: 'admin@gmail.com' });

  if (adminUser) {
    console.log('Admin User Already Exists');
    return next();
  }

  if (!adminUser) {
    await User.create({
      empName: 'Admin User',
      email: 'admin@gmail.com',
      empID: '999897',
      password: 'password',
      passwordConfirm: 'password',
      role: 'admin',
    });
    console.log('Admin User Created');
  }

  next();
});
