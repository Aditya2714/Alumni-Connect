const User = require("../models/user");
const Alumni = require("../models/alumniModel");
const { Admin } = require("../models/adminModel");
const Event = require("../models/eventModel");
const { Job } = require("../models/job");
const Announcement = require("../models/announcementModel");
const Recognition = require("../models/recognitionModel");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailHelper");

const requireAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ status: "fail", message: "Admin access required" });
    return false;
  }
  return true;
};

const getAdminOverview = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const [
      users,
      alumni,
      admins,
      events,
      jobs,
      announcements,
      recognitions,
      pendingAlumni,
      approvedAlumniUsers,
      rejectedAlumniUsers,
      alumniByBranch,
      alumniByBatch,
      jobsByStatus,
      eventsByType,
      announcementsByAudience,
      recentAlumni,
      recentEvents,
      recentJobs,
      recentAnnouncements,
    ] = await Promise.all([
      User.countDocuments(),
      Alumni.countDocuments(),
      Admin.countDocuments(),
      Event.countDocuments(),
      Job.countDocuments(),
      Announcement.countDocuments(),
      Recognition.countDocuments(),
      User.countDocuments({
        role: "alumni",
        isApproved: false,
        approvalStatus: { $ne: "rejected" },
      }),
      User.countDocuments({
        role: "alumni",
        isApproved: true,
        approvalStatus: "approved",
      }),
      User.countDocuments({
        role: "alumni",
        approvalStatus: "rejected",
      }),
      Alumni.aggregate([
        { $group: { _id: "$branch", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 6 },
      ]),
      Alumni.aggregate([
        { $group: { _id: "$endYear", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 6 },
      ]),
      Job.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Event.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 6 },
      ]),
      Announcement.aggregate([
        { $group: { _id: "$audience", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 6 },
      ]),
      Alumni.find()
        .select("firstName lastName email branch endYear company designation createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
      Event.find().select("title date type attendees createdAt").sort({ createdAt: -1 }).limit(5),
      Job.find().select("title company status vacancy createdAt").sort({ createdAt: -1 }).limit(5),
      Announcement.find().select("title audience createdAt").sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        overview: {
          users,
          alumni,
          admins,
          events,
          jobs,
          announcements,
          recognitions,
          pendingAlumni,
          approvedAlumniUsers,
          rejectedAlumniUsers,
          breakdowns: {
            alumniByBranch: alumniByBranch.map((item) => ({
              label: item._id || "Not added",
              count: item.count,
            })),
            alumniByBatch: alumniByBatch.map((item) => ({
              label: item._id || "Not added",
              count: item.count,
            })),
            jobsByStatus: jobsByStatus.map((item) => ({
              label: item._id || "Not added",
              count: item.count,
            })),
            eventsByType: eventsByType.map((item) => ({
              label: item._id || "Not added",
              count: item.count,
            })),
            announcementsByAudience: announcementsByAudience.map((item) => ({
              label: item._id || "Not added",
              count: item.count,
            })),
          },
          recent: {
            alumni: recentAlumni,
            events: recentEvents,
            jobs: recentJobs,
            announcements: recentAnnouncements,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const getUsersForAdmin = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password").sort({ _id: -1 });

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const getPendingAlumni = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const pendingUsers = await User.find({
      role: "alumni",
      isApproved: false,
      approvalStatus: { $ne: "rejected" },
    })
      .select("-password")
      .sort({ _id: -1 });

    const userIds = pendingUsers.map((user) => user._id);
    const profiles = await Alumni.find({ user: { $in: userIds } });
    const profileByUser = profiles.reduce((map, profile) => {
      map[profile.user.toString()] = profile;
      return map;
    }, {});

    const alumni = pendingUsers.map((user) => ({
      ...user.toObject(),
      profile: profileByUser[user._id.toString()] || null,
    }));

    return res.status(200).json({
      status: "success",
      results: alumni.length,
      data: { alumni },
    });
  } catch (error) {
    console.error("Error fetching pending alumni:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const updateUserApproval = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { isApproved, approvalStatus } = req.body;
    const nextStatus = approvalStatus || (isApproved ? "approved" : "rejected");

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isApproved: nextStatus === "approved",
        approvalStatus: nextStatus,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    try {
      if (nextStatus === "approved") {
        await sendApprovalEmail(user.email, user.name);
      } else if (nextStatus === "rejected") {
        await sendRejectionEmail(user.email, user.name);
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    return res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error updating user approval:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  getAdminOverview,
  getPendingAlumni,
  getUsersForAdmin,
  updateUserApproval,
};
