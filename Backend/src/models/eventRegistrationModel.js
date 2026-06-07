const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);

module.exports = EventRegistration;
