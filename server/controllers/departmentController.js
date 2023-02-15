const Department = require('../models/departmentModel');
const catchAsync = require('../utils/catchAsync');
//const appError = require('../utils/appError');

exports.getAllDepartments = catchAsync(async (req, res, next) => {
  const departments = await Department.find();

  res.status(200).json({
    status: 'success',
    results: departments.length,
    data: {
      departments,
    },
  });
});

exports.createDepartment = catchAsync(async (req, res, next) => {
  const newDepartment = await Department.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      department: newDepartment,
    },
  });
});
