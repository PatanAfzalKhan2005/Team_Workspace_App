const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// test routes
router.get("/register", (req, res) => {
  res.send("Register route working");
});

router.get("/login", (req, res) => {
  res.send("Login route working");
});

// actual APIs
router.post("/register", register);
router.post("/login", login);

module.exports = router;