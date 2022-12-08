const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
  },
  enterTime: [
    {
      type: Date,
    },
  ],
  leaveTime: [{ type: Date }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userInfo", UserInfoSchema);
