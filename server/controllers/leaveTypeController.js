const LeaveType = require('../models/leavetypeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const APIFeatures = require('../utils/apiFeatures');

exports.updatedefaultLeaves = catchAsync(async (req, res, next) => {
  const leaveType = await LeaveType.findById(req.params.id);

  if (!leaveType) {
    return next(new AppError('No leave details found with that ID', 404));
  }
  if (req.body.causal !== undefined) {
    leaveType.leavedetails.causal = req.body.causal;
  }

  if (req.body.sick !== undefined) {
    leaveType.leavedetails.sick = req.body.sick;
  }

  if (req.body.maternity !== undefined) {
    leaveType.leavedetails.maternity = req.body.maternity;
  }

  if (req.body.paternity !== undefined) {
    leaveType.leavedetails.paternity = req.body.paternity;
  }

  await leaveType.save({ validateBeforeSave: false });
});
