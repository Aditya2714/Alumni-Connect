const User = require("../models/user");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const admin = await User.create({
        name: process.env.ADMIN_NAME || "CMRIT Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
        isApproved: true,
        approvalStatus: "approved",
      });

      console.log("Default admin created:", admin.email);
    } else {
      console.log("Admin already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Admin seed error:", error);
  }
};

module.exports = seedAdmin;
