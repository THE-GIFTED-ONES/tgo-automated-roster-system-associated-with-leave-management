const mongoose = require('mongoose');

const RoosterSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  shifts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
    },
  ],
  date: {
    type: Date,
    required: true,
  },
});

const Rooster = mongoose.model('Rooster', RoosterSchema);

module.exports = Rooster;
