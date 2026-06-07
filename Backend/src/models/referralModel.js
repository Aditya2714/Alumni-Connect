const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: {
      type: String,
      trim: true,
      default: "Alumni",
    },
    requesterEmail: {
      type: String,
      trim: true,
      required: true,
    },
    targetRole: {
      type: String,
      trim: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shared", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
