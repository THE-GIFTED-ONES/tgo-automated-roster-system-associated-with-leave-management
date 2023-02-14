const mongoose = require('mongoose');

const LeaveTypeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.types.ObjectId,
    ref: 'User',
  },
  leavedetails: {
    causal: {
      type: Number,
    },
    sick: {
      type: Number,
    },
    maternity: {
      type: Number,
    },
    paternity: {
      type: Number,
    },
  },
});

const LeaveType = mongoose.model('LeaveType', LeaveTypeSchema);

module.exports = LeaveType;
