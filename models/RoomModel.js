const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("room", RoomSchema);
