const Event = require("../models/eventModel");
const EventRegistration = require("../models/eventRegistrationModel");

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
    const registrations = await EventRegistration.find({ user: req.user._id });
    const registeredEventIds = new Set(
      registrations.map((registration) => registration.event.toString())
    );
    const eventsWithRegistration = events.map((event) => ({
      ...event.toObject(),
      isRegistered: registeredEventIds.has(event._id.toString()),
    }));

    res.status(200).json({
      status: "success",
      data: {
        events: eventsWithRegistration,
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

const toggleEventRegistrationController = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ status: "fail", message: "Only alumni can register for events" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    const existingRegistration = await EventRegistration.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existingRegistration) {
      await EventRegistration.findByIdAndDelete(existingRegistration._id);
      event.attendees = Math.max((event.attendees || 0) - 1, 0);
      await event.save();

      return res.status(200).json({
        status: "success",
        message: "Event registration cancelled",
        data: { event: { ...event.toObject(), isRegistered: false } },
      });
    }

    await EventRegistration.create({
      event: event._id,
      user: req.user._id,
    });
    event.attendees = (event.attendees || 0) + 1;
    await event.save();

    return res.status(200).json({
      status: "success",
      message: "Event registered successfully",
      data: { event: { ...event.toObject(), isRegistered: true } },
    });
  } catch (error) {
    console.error("Error updating event registration:", error);
    return res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
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
  toggleEventRegistrationController,
  updateEventController,
};
