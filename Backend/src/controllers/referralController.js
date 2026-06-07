const Alumni = require("../models/alumniModel");
const Referral = require("../models/referralModel");

const getRequesterName = async (user) => {
  const profile = await Alumni.findOne({ user: user._id });
  return (
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.email
  );
};

const getReferralRequests = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { requester: req.user._id };
    const referrals = await Referral.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: referrals.length,
      data: { referrals },
    });
  } catch (error) {
    console.error("Error fetching referral requests:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const createReferralRequest = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ status: "fail", message: "Only alumni can request referrals" });
    }

    const { targetRole, company, reason } = req.body;
    if (!targetRole || !company || !reason) {
      return res.status(400).json({ status: "fail", message: "Role, company, and reason are required" });
    }

    const referral = await Referral.create({
      requester: req.user._id,
      requesterName: await getRequesterName(req.user),
      requesterEmail: req.user.email,
      targetRole,
      company,
      reason,
    });

    return res.status(201).json({
      status: "success",
      message: "Referral request submitted",
      data: { referral },
    });
  } catch (error) {
    console.error("Error creating referral request:", error);
    return res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
  }
};

const updateReferralStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: "fail", message: "Only admin can update referral status" });
    }

    const { status, adminNote = "" } = req.body;
    if (!["pending", "reviewing", "shared", "rejected"].includes(status)) {
      return res.status(400).json({ status: "fail", message: "Invalid referral status" });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.referralId,
      { status, adminNote },
      { new: true, runValidators: true }
    );

    if (!referral) {
      return res.status(404).json({ status: "fail", message: "Referral request not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { referral },
    });
  } catch (error) {
    console.error("Error updating referral status:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  createReferralRequest,
  getReferralRequests,
  updateReferralStatus,
};
