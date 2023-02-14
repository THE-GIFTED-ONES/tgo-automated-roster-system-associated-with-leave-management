const mongoose = require('mongoose');

const LeaveTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  noOfLeaves: {
    type: Number,
  },
});

const LeaveType = mongoose.model('LeaveType', LeaveTypeSchema);

module.exports = LeaveType;
