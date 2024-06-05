const express = require("express");
const protectedRoute = require("../middleware/protectedRoute.js");
const {
  deleteNotifications,
  getNotifications,
} = require("../controllers/notifications.controller.js");

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/", protectedRoute, deleteNotifications);

module.exports = router;
