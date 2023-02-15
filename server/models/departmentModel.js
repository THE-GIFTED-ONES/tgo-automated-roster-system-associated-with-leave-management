const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required !!'],
    unique: [true, 'Department already exists !!'],
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
