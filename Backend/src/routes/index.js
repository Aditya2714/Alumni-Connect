const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");
const bulkImportRoute = require("./bulkImportRoute");
const profileRoutes = require("./profileRoutes");
const alumniRoutes = require("./alumniRoutes");
const adminRoutes = require("./adminRoutes");
const announcementRoutes = require("./announcementRoutes");
const recognitionRoutes = require("./recognitionRoutes");

// ✅ root test
router.get("/", (req, res) => {
  console.log("Server is up and running.");
  res.send("Server is up and running.");
});

// ✅ routes
router.use("/register", registerRoute);
router.use("/event", eventRoutes);
router.use("/auth", loginRoute);   // 👉 IMPORTANT
router.use("/jobs", jobRoutes);
router.use("/bulk", bulkImportRoute);
router.use("/profile", profileRoutes);
router.use("/alumni", alumniRoutes);
router.use("/admin", adminRoutes);
router.use("/announcements", announcementRoutes);
router.use("/recognition", recognitionRoutes);
router.use("/", alumniListRoute);

module.exports = router;
