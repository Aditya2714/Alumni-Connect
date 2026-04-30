const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Alumni = require("../models/alumniModel");
const { Admin } = require("../models/adminModel");

// REGISTER API
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "alumni",
      startYear,
      endYear,
      degree,
      branch,
      rollNumber,
      firstName,
      lastName,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    if (!["alumni", "admin"].includes(role)) {
      return res.status(400).json({ message: "Only alumni and admin registration are supported" });
    }

    if (
      role === "alumni" &&
      (!firstName || !startYear || !endYear || !degree || !branch || !rollNumber)
    ) {
      return res.status(400).json({ message: "Alumni academic details are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered. Please use a different email.",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      isApproved: role === "admin",
      approvalStatus: role === "admin" ? "approved" : "pending",
    });
    await user.save();

    if (role === "admin") {
      await Admin.create({
        user: user._id,
        adminName: name || email,
        email,
        password,
      });
    }

    if (role === "alumni") {
      await Alumni.create({
        user: user._id,
        email,
        password,
        startYear,
        endYear,
        degree,
        branch,
        rollNumber,
        firstName,
        lastName,
      });
    }

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
