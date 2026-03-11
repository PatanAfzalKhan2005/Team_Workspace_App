const express = require("express");
const router = express.Router();

const { createChannel, getChannels, getAllChannels } = require("../controllers/channelController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createChannel);
router.get("/all", authMiddleware, getAllChannels);
router.get("/:workspaceId", authMiddleware, getChannels);

module.exports = router;