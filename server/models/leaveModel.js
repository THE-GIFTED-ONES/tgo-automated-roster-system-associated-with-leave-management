const mongoose = require('mongoose'); // import mongoose

//const LeaveType = require('./leavetypeModel');

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
      type: String,
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
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

LeaveSchema.pre('save', async function (next) {
  this.noofdays = this.date.length;
  next();
});

const Leave = mongoose.model('Leave-Request', LeaveSchema);
module.exports = Leave;
