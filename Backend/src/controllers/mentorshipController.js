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

const formatMentor = (profile) => ({
  id: profile._id,
  userId: profile.user,
  name:
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.email,
  email: profile.email,
  batch: profile.endYear || "Not added",
  branch: profile.branch || "Not added",
  company: profile.company || "Not added",
  designation: profile.designation || "Alumni",
});

const getMentors = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ status: "fail", message: "Only alumni can view mentors" });
    }

    const mentors = await Alumni.find({ user: { $ne: req.user._id } })
      .sort({ firstName: 1, lastName: 1 })
      .limit(100);

    return res.status(200).json({
      status: "success",
      results: mentors.length,
      data: { mentors: mentors.map(formatMentor) },
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const getMentorshipRequests = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const requests = await Mentorship.find().sort({ createdAt: -1 });

      return res.status(200).json({
        status: "success",
        results: requests.length,
        data: { requests },
      });
    }

    const [sent, received] = await Promise.all([
      Mentorship.find({ requester: req.user._id }).sort({ createdAt: -1 }),
      Mentorship.find({ mentor: req.user._id }).sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      status: "success",
      results: sent.length + received.length,
      data: { requests: sent, sent, received },
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

    const { topic, mode, message, mentorId } = req.body;
    if (!topic || !message || !mentorId) {
      return res.status(400).json({ status: "fail", message: "Topic, mentor, and message are required" });
    }

    const mentorProfile = await Alumni.findById(mentorId);
    if (!mentorProfile) {
      return res.status(404).json({ status: "fail", message: "Selected mentor not found" });
    }

    if (mentorProfile.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ status: "fail", message: "You cannot send a mentorship request to yourself" });
    }

    const requesterName = await getRequesterName(req.user);
    const mentorName =
      [mentorProfile.firstName, mentorProfile.lastName].filter(Boolean).join(" ") ||
      mentorProfile.email;
    const request = await Mentorship.create({
      requester: req.user._id,
      requesterName,
      requesterEmail: req.user.email,
      mentor: mentorProfile.user,
      mentorName,
      mentorEmail: mentorProfile.email,
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
    const { status, adminNote = "" } = req.body;
    if (!["pending", "accepted", "completed", "rejected"].includes(status)) {
      return res.status(400).json({ status: "fail", message: "Invalid mentorship status" });
    }

    const request = await Mentorship.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ status: "fail", message: "Mentorship request not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignedMentor = request.mentor?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedMentor) {
      return res.status(403).json({ status: "fail", message: "Only the assigned mentor or admin can update this request" });
    }

    request.status = status;
    if (isAdmin) request.adminNote = adminNote;
    await request.save();

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
  getMentors,
  getMentorshipRequests,
  updateMentorshipStatus,
};
