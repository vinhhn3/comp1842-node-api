const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").isLength({ min: 6 }),
    check("role", "Role is required").isIn(["admin", "customer"]),
  ],
  authController.registerUser
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  authController.loginUser
);

router.get("/", auth, authController.getUser);

module.exports = router;
