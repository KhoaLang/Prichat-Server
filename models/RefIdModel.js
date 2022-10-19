const mongoose = require("mongoose");

const RefIdSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
  },
  faces: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("refId", RefIdSchema);
