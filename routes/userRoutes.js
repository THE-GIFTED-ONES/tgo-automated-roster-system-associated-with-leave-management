const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.post("/register", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// @route PATCH api/v1/users/addToDepartment
// @desc Add user to department
// @access Private, Restricted to Admin/DepartmentHead

router.route("/addToDepartment").patch(userController.addToDepartment);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Check if the user is authenticated
    return next(); // User is authenticated, allow access to the next middleware or route handler
  }
  res.redirect("/login"); // User is not authenticated, redirect to login page
}

router.get("/dashboard", isLoggedIn, (req, res) => {
  console.log("auth:", req.auth);
  res.render("dashboard");
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
