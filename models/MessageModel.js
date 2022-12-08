const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: Buffer,
    },
  ],

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("message", MessageSchema);
