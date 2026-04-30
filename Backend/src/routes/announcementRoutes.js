const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

router.use(checkAuth);
router.get("/", getAnnouncements);
router.post("/", createAnnouncement);
router.patch("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
