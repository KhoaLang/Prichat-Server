const mongoose = require("mongoose");

const TestUserSchema = new mongoose.Schema({
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

module.exports = mongoose.model("testUser", TestUserSchema);