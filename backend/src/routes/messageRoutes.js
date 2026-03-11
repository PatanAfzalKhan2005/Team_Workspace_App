const express = require("express");
const router = express.Router();

const { sendMessage, getMessages, getAllMessages } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", authMiddleware, sendMessage);
router.get("/all", authMiddleware, getAllMessages);
router.get("/:channelId", authMiddleware, getMessages);

module.exports = router;