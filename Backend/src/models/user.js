const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false   // optional (since you're not sending it currently)
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["alumni", "admin", "college"],
    default: "alumni"
  },
  isApproved: {
    type: Boolean,
    default: true   // ✅ CHANGED HERE
  }
});

module.exports = mongoose.model("User", userSchema);