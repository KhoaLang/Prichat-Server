const mongoose = require("mongoose");

const TimeStampSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  enterTime: { type: String },
  leaveTime: { type: String },
});

module.exports = mongoose.model("timestamp", TimeStampSchema);
