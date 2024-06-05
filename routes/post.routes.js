const express = require("express");
const protectedRoute = require("../middleware/protectedRoute.js");
const {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
} = require("../controllers/post.controller.js");

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/liked/:id", protectedRoute, getLikedPosts);
router.get("/following", protectedRoute, getFollowingPosts);

router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/:id", protectedRoute, deletePost);

module.exports = router;
