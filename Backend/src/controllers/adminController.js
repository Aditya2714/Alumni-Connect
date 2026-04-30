const User = require("../models/user");
const Alumni = require("../models/alumniModel");
const { Admin } = require("../models/adminModel");
const Event = require("../models/eventModel");
const { Job } = require("../models/job");
const Announcement = require("../models/announcementModel");
const Recognition = require("../models/recognitionModel");

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
