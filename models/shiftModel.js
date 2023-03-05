const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

const Shift = mongoose.model('Shift', ShiftSchema);

module.exports = Shift;
