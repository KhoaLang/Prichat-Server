const mongoose = require("mongoose");

const TestUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  face1: {
    type: String,
  },
  face2: {
    type: String,
  },
  face3: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("testUser", TestUserSchema);
