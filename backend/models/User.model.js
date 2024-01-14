const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
    pastInterviews: [{ type: Schema.Types.ObjectId, ref: "Interview" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
