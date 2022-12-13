const catchAsync = require("../middlewares/catchAsync");
const UserInfoModel = require("../models/UserInfoModel");

exports.createUser = catchAsync(async (req, res) => {
  const { name, id } = req.body;

  const user = await UserInfoModel.create({
    _id: id, //tạo 1 custom object id dựa trên id người dùng nhập vào
    name,
  });

  res.json({
    success: true,
    message: "Create new user success",
    padyload: user,
  });
});

// exports.getFacesById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   let raw_data = await UserInfoModel.findOne({ _id: id });

//   res.json({
//     success: true,
//     message: "Retrieve faces success",
//     payload: raw_data,
//   });
// });

exports.updateUserEnterTime = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { time } = req.body;

  // console.log("id là: ", id);
  // console.log("Thời gian vô là: ", time);

  // const user = await UserInfoModel.findById(id);
  // if (user.enterTime.length > user.leaveTime.length) {
  //   await UserInfoModel.updateOne({ _id: id }, { $push: { leaveTime: time } });
  // } else {
  await UserInfoModel.updateOne({ _id: id }, { $push: { enterTime: time } });
  // }
  res.json({ success: true, message: "Update user success" });
});

exports.updateUserLeaveTime = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { time } = req.body;

  // console.log("id là: ", id);
  // console.log("Thời gian vô là: ", time);

  // const user = await UserInfoModel.findById(id);
  // if (user.enterTime.length > user.leaveTime.length) {
  await UserInfoModel.updateOne({ _id: id }, { $push: { leaveTime: time } });
  // } else {
  // await UserInfoModel.updateOne({ _id: id }, { $push: { enterTime: time } });
  // }
  res.json({ success: true, message: "Update user success" });
});

exports.getUserInfoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { onlyBasic } = req.body;

  const user = onlyBasic
    ? await UserInfoModel.findById(id).select("-enterTime -leaveTime")
    : await UserInfoModel.findById(id);

  res.json({
    success: true,
    message: "Retrieve data success",
    payload: user,
  });
});
