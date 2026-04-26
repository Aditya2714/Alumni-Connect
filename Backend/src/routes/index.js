const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");

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
router.use("/", alumniListRoute);

module.exports = router;