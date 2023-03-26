const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const User = require('../models/userModel');

const createAdminUserIfNotExists = catchAsync(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    // Database connection not established yet, wait for connection to be established
    mongoose.connection.once('open', async () => {
      await createAdminUserIfNotExists(req, res, next);
    });
    return;
  }

  const adminUser = await User.findOne({ email: 'admin@gmail.com' });
  if (!adminUser) {
    const newAdminUser = new User({
      empName: 'admin user',
      email: 'admin@gmail.com',
      empID: '999897',
      password: 'password@1234',
      passwordConfirm: 'password@1234',
      role: 'admin',
    });
    await newAdminUser.save({ validateBeforeSave: false });
    console.log('Admin user created');
  }
  next();
});

module.exports = createAdminUserIfNotExists;
