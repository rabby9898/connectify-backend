const express = require("express");
const protectedRoute = require("../middleware/protectedRoute.js");
const {
  getUserProfile,
  followUnfollowUser,
  suggestedUser,
} = require("../controllers/user.controllers.js");

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, suggestedUser);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
// router.post("/update", protectedRoute, updateUserProfile);

module.exports = router;
