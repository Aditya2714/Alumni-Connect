const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const {
  getAdminOverview,
  getPendingAlumni,
  getUsersForAdmin,
  updateUserApproval,
} = require("../controllers/adminController");

const router = express.Router();

router.use(checkAuth);
router.get("/overview", getAdminOverview);
router.get("/pending-alumni", getPendingAlumni);
router.get("/users", getUsersForAdmin);
router.patch("/users/:userId/approval", updateUserApproval);

module.exports = router;
