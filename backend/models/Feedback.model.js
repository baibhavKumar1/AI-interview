const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  strengths: [{ type: String }],
  improvementAreas: [{type:String }],
  overallScore: Number
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
