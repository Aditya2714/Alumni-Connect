const Alumni = require("../models/alumniModel");
const Mentorship = require("../models/mentorshipModel");

const getRequesterName = async (user) => {
  if (user.role !== "alumni") return user.name || user.email;

  const profile = await Alumni.findOne({ user: user._id });
  return (
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.email
  );
};

const getMentorshipRequests = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { requester: req.user._id };
    const requests = await Mentorship.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: requests.length,
      data: { requests },
    });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const createMentorshipRequest = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ status: "fail", message: "Only alumni can create mentorship requests" });
    }

    const { topic, mode, message } = req.body;
    if (!topic || !message) {
      return res.status(400).json({ status: "fail", message: "Topic and message are required" });
    }

    const requesterName = await getRequesterName(req.user);
    const request = await Mentorship.create({
      requester: req.user._id,
      requesterName,
      requesterEmail: req.user.email,
      topic,
      mode: mode || "Flexible",
      message,
    });

    return res.status(201).json({
      status: "success",
      message: "Mentorship request submitted",
      data: { request },
    });
  } catch (error) {
    console.error("Error creating mentorship request:", error);
    return res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
  }
};

const updateMentorshipStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Only admin can update mentorship status" });
    }

    const { status, adminNote = "" } = req.body;
    if (!["pending", "accepted", "completed", "rejected"].includes(status)) {
      return res.status(400).json({ status: "fail", message: "Invalid mentorship status" });
    }

    const request = await Mentorship.findByIdAndUpdate(
      req.params.requestId,
      { status, adminNote },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ status: "fail", message: "Mentorship request not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { request },
    });
  } catch (error) {
    console.error("Error updating mentorship status:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  createMentorshipRequest,
  getMentorshipRequests,
  updateMentorshipStatus,
};
