const express = require('express');
const departmentController = require('../controllers/departmentController');

const router = express.Router(); // create a router

router
  .route('/')
  .post(departmentController.createDepartment)
  .get(departmentController.getAllDepartments);

module.exports = router; // Export the router
