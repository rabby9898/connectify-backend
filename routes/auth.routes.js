const express = require("express");
const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controllers.js");
const protectedRoute = require("../middleware/protectedRoute.js");

const router = express.Router();

router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
