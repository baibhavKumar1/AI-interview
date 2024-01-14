const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema({
  token: String,
});

const BlackList = mongoose.model("BlackList", blackListSchema);

module.exports = BlackList;
