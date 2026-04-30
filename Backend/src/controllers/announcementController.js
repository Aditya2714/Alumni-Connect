const Announcement = require("../models/announcementModel");

const createAnnouncement = async (req, res) => {
  try {
    const { title, audience, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        status: "fail",
        message: "Title and message are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      audience,
      message,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      status: "success",
      data: { announcement },
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: announcements.length,
      data: { announcements },
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Admin access required" });
    }

    const allowedFields = ["title", "audience", "message"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ status: "fail", message: "Announcement not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { announcement },
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Admin access required" });
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ status: "fail", message: "Announcement not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
};
