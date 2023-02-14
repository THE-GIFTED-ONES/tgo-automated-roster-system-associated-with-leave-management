const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  roosters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rooster',
    },
  ],
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = Department;
