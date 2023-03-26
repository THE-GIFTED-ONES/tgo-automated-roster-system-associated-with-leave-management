const express = require('express');
const leaveController = require('../controllers/leaveController');
const authController = require('../controllers/authController');

const router = express.Router(); // create a router

// @route GET api/v1/leaves
// @desc Get all existing leaves
// @access Private, Restricted to Admin/DepartmentHead

// @route POST api/v1/leaves
// @desc Create a new leave
// @access Public

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    leaveController.getAllLeaves
  )
  .post(authController.protect, leaveController.createLeave);
// Create a route for the root path and use the getAllLeaves and createLeave functions from leaveController

// @route GET api/v1/leaves/getUserLeaves
// @desc Get all leaves of a user
// @access Public

router
  .route('/getUserLeaves')
  .get(authController.protect, leaveController.getUserLeaves);

// route PATCH api/v1/:id/appprove
// @desc Approve or reject a leave
// @access Private, Restricted to Admin

router
  .route('/:id/approve')
  .patch(
    authController.protect,
    authController.restrictTo('Admin'),
    leaveController.approveORrejectLeave
  );

// @route GET api/v1/leaves/:id
// @desc Get a leave
// @access Private, Restricted to Admin/DepartmentHead

router.route('/:id').get(authController.protect, leaveController.getLeave);

router.route('/filter').post(leaveController.filterLeavesByDate);

//@route GET api/v1/leaves/

module.exports = router; // Export the router
