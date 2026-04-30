const express = require("express");
const router = express.Router();
const {
  createEventController,
  deleteEventController,
  getAllEventsController,
  updateEventController,
} = require("../controllers/eventController");
const checkAuth = require("../middlewares/checkAuth");

// Assuming you have middleware for authentication
router.use(checkAuth);

router.post("/create", createEventController);
router.get("/all", getAllEventsController);
router.patch("/:id", updateEventController);
router.delete("/:id", deleteEventController);

module.exports = router;
