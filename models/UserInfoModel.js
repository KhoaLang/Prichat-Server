const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    enterTime: [
      {
        type: String,
      },
    ],
    leaveTime: [{ type: String }],
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userInfo", UserInfoSchema);
