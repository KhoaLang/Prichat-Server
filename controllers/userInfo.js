const catchAsync = require("../middlewares/catchAsync");
const UserInfoModel = require("../models/UserInfoModel");

exports.createUser = catchAsync(async (req, res) => {
  const { name, id } = req.body;

  await UserInfoModel.create({
    _id: id, //tạo 1 custom object id dựa trên id người dùng nhập vào
    name,
  });

  res.json({
    success: true,
    message: "Create new user success",
  });
});

exports.getFacesById = catchAsync(async (req, res) => {
  const { id } = req.params;
  let raw_data = await UserInfoModel.findOne({ _id: id });

  res.json({
    success: true,
    message: "Retrieve faces success",
    payload: raw_data,
  });
});

exports.updateUserTime = catchAsync(async (req, res) => {
  const { id, enterTime, leaveTime } = req.body;

  if (enterTime) {
    await UserInfoModel.updateOne(
      { _id: id },
      { $push: { enterTime: enterTime } }
    );
  } else {
    await UserInfoModel.updateOne(
      { _id: id },
      { $push: { leaveTime: leaveTime } }
    );
  }

  res.json({ success: true, message: "Update user success" });
});
