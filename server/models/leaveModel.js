const mongoose = require('mongoose'); // import mongoose

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: [
      {
        type: Date,
        required: true,
      },
    ],
    noofdays: {
      type: Number,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
    },
    status: {
      type: String,
      default: 'Pending',
    },
    reason: {
      type: String,
    },
    approved_rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

LeaveSchema.pre('save', async function (next) {
  this.noofdays = this.date.length;
  next();
});

LeaveSchema.methods.approveLeave = function (empID) {
  this.status = 'Approved';
  this.approved_rejectedBy = empID;
};

const Leave = mongoose.model('Leave-Request', LeaveSchema);
// create a model from the schema

module.exports = Leave; // export the model
