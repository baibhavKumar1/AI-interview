const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  interviewType: String,
  conversation: [],
  videoPath: String,
  feedback: String
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
