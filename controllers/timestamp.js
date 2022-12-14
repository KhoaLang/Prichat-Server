const catchAsync = require("../middlewares/catchAsync");
const TimeStampModel = require("../models/TimeStampModel");
const mongoose = require("mongoose");

exports.createTimestamp = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { enterTime, leaveTime } = req.body;

  enterTime
    ? await TimeStampModel.create({
        user: id,
        enterTime,
        leaveTime: null,
      })
    : await TimeStampModel.create({
        user: id,
        enterTime: null,
        leaveTime,
      });

  res.json({
    success: "true",
    message: "Create timestamp success",
  });
});
