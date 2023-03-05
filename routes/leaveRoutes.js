const express = require('express');
const leaveController = require('../controllers/leaveController');
const authController = require('../controllers/authController');

const router = express.Router(); // create a router

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('Admin'),
    leaveController.getAllLeaves
  )
  .post(authController.protect, leaveController.createLeave);
// Create a route for the root path and use the getAllLeaves and createLeave functions from leaveController

router
  .route('/getUserLeaves')
  .get(authController.protect, leaveController.getUserLeaves);

router.route('/:id').get(leaveController.getLeave);

module.exports = router; // Export the router
