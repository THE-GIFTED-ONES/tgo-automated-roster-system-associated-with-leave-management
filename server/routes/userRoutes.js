const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// @route PATCH api/v1/users/addToDepartment
// @desc Add user to department
// @access Private, Restricted to Admin/DepartmentHead

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// @route POST api/v1/users/newuser
// @desc Create new user
// @access Private, Restricted to Admin/DepartmentHead

router.post('/newuser', authController.createNewUser);

// @route PATCH api/v1/users/firstResetPassword/:token
// @desc Reset password for new user
// @access Public

router.patch('/firstResetPassword/:token', authController.firstPasswordReset);

module.exports = router;
//
