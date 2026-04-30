const Event = require("../models/eventModel");

const createEventController = async (req, res) => {
  try {
    const { title, date, location, description, time, type, attendees } = req.body;

    if (!title || !date || !location || !description) {
      return res.status(400).json({
        status: "fail",
        message: "Title, date, location, and description are required",
      });
    }

    const event = await Event.create({
      title,
      date,
      location,
      description,
      time,
      type,
      attendees,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getAllEventsController = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email role")
      .sort({ date: 1 });

    res.status(200).json({
      status: "success",
      data: {
        events,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const updateEventController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Admin access required" });
    }

    const allowedFields = [
      "title",
      "date",
      "location",
      "description",
      "time",
      "type",
      "attendees",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const deleteEventController = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Admin access required" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  createEventController,
  deleteEventController,
  getAllEventsController,
  updateEventController,
};
