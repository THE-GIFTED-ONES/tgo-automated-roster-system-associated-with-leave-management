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
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model('Leave-Request', LeaveSchema);
// create a model from the schema

module.exports = Leave; // export the model
