const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
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
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mentorName: {
      type: String,
      trim: true,
      default: "Not assigned",
    },
    mentorEmail: {
      type: String,
      trim: true,
      default: "",
    },
    topic: {
      type: String,
      trim: true,
      required: true,
    },
    mode: {
      type: String,
      trim: true,
      default: "Flexible",
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected"],
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

const Mentorship = mongoose.model("Mentorship", mentorshipSchema);

module.exports = Mentorship;
