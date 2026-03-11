const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getActivityFeed } = require("../controllers/activityController");

router.get("/", authMiddleware, getActivityFeed);

module.exports = router;
