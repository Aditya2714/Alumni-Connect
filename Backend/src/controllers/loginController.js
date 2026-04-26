const User = require("../models/user");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log("LOGIN DATA:", req.body);

    if (!email || !password || !role) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    // 🔥 HANDLE ALUMNI
    if (role === "alumni") {
      const user = await User.findOne({ email, role: "alumni" });

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Alumni not found",
        });
      }

      if (!user.isApproved) {
        return res.status(403).json({
          status: "fail",
          message: "Alumni not approved",
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          status: "fail",
          message: "Incorrect password",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.cookie("jwt", token, {
        httpOnly: true,
      });

      return res.status(200).json({
        alumni: user,
      });
    }

    // 🔥 HANDLE ADMIN
    if (role === "admin") {
      const user = await User.findOne({
        email,
        role: "admin",
        isApproved: true,
      });

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "Admin not found",
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          status: "fail",
          message: "Incorrect password",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.cookie("jwt", token, {
        httpOnly: true,
      });

      return res.status(200).json({
        admin: user,
      });
    }

    // 🔥 TEMP: disable other roles to avoid crash
    return res.status(400).json({
      status: "fail",
      message: "Role not supported yet",
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }
};

module.exports = loginController;