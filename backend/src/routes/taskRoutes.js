const express = require("express");
const router = express.Router();

const { createTask, getTasks, getAllTasks, updateTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createTask);
router.get("/all", authMiddleware, getAllTasks);
router.get("/:channelId", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);

module.exports = router;