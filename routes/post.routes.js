const express = require("express");
const protectedRoute = require("../middleware/protectedRoute.js");
const {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
} = require("../controllers/post.controller.js");

const router = express.Router();

router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/:id", protectedRoute, deletePost);

module.exports = router;
