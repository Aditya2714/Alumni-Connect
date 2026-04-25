const express = require("express");
const router = express.Router();
const User = require("../models/user");   // 👈 ADD THIS

// REGISTER API
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;