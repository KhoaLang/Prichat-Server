const catchAsync = require("../middlewares/catchAsync");
const TimeStampModel = require("../models/TimeStampModel");
const mongoose = require("mongoose");
const UserInfoModel = require("../models/UserInfoModel");

exports.createTimestamp = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { enterTime, leaveTime } = req.body;

  const user = await UserInfoModel.findById(id);
  console.log("Create timestamp");

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

exports.getLatestTimestamp = catchAsync(async (req, res) => {
  let data = await TimeStampModel.findOne({}, {}, { sort: { created_at: -1 } });
  res.json({
    success: "true",
    message: "Retrieve timestamp success",
    payload: data,
  });
});
