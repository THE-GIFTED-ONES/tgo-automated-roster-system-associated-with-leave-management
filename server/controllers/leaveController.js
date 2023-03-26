const LeaveRequest = require('../models/leaveModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');



exports.getAllLeaves = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(LeaveRequest.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({
      path: 'employee',
      select: 'name empID',
    })
    .populate({
      path: 'approved_rejectedBy',
      select: 'name empID',
    });
  const leaves = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: leaves.length,
    data: {
      leave: leaves,
    },
  });
});

exports.createLeave = catchAsync(async (req, res, next) => {
  const loggedUser = req.saveduser;
  const newLeave = await LeaveRequest.create({
    employee: loggedUser._id,
    date: req.body.date,
    reason: req.body.reason,
    type: req.body.type,
  });
  await newLeave.save();

  res.status(201).json({
    status: 'success',
    data: {
      leave: newLeave,
    },
  });
});

exports.getLeave = catchAsync(async (req, res, next) => {
  const leave = await LeaveRequest.findById(req.params.id)
    .populate({
      path: 'employee',
      select: 'name empID',
    })
    .populate({
      path: 'approved_rejectedBy',
      select: 'name empID',
    })
    .select('-__v -createdAt -updatedAt');

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      leave,
    },
  });
});
exports.getUserLeaves = catchAsync(async (req, res, next) => {
  const leave = await LeaveRequest.find({ emp_id: req.emp_id });

  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      leave: leave,
    },
  });
});

exports.approveORrejectLeave = catchAsync(async (req, res, next) => {
  const loggedUser = req.saveduser;

  const leave = await LeaveRequest.findById(req.params.id);

  //01.) Check Whether relevant Leave Available
  if (!leave) {
    return next(new AppError('No leave found with that ID', 404));
  }

  const { employee, noofdays, type } = leave;

  //02.) Check Whether already approved?
  if (leave.status === 'Approved') {
    return next(new AppError('Leave already approved', 400));
  }

  //03.) Check Whether the logged in user is the same as the employee
  if (loggedUser._id === employee) {
    return next(new AppError('You cannot approve your own leave', 400));
  }

  //04.) Update the leave
  leave.status = req.body.status;
  leave.approved_rejectedBy = loggedUser._id;
  leave.feedback = req.body.feedback;

  await leave.save();

  const requesteduser = await User.findById(employee);

  if (req.body.status === 'Approved') {
    requesteduser.updateLeaves(type, noofdays, req.params.id);
  }

  res.status(200).json({
    status: 'success',
    message: `Leave ${req.body.status}`,
    data: {
      leavebalance: requesteduser.avaliableLeaves,
    },
  });
});


exports.filterLeavesByDate = catchAsync(async (req, res, next) => {
  const enteredDate = new Date(req.query.date);
  const leaveRequests = await LeaveRequest.find();

  const filteredLeaveRequests = leaveRequests.reduce(
    (filteredLeaves, leave) => {
      // Use the `some()` method to check if the entered date is available in the date array of each leave request
      if (
        leave.date.some(
          (date) => new Date(date).toDateString() === enteredDate.toDateString()
        )
      ) {
        filteredLeaves.push(leave); // Add the leave request to the filtered array if the entered date is available
      }
      return filteredLeaves; // Return the filtered array
    },
    []
  );

  res.status(200).json({
    status: 'success',
    results: filteredLeaveRequests.length,
    data: {
      leave: filteredLeaveRequests,
    },
  });
});
