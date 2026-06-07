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
