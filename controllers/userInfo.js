const catchAsync = require("../middlewares/catchAsync");
const UserInfoModel = require("../models/UserInfoModel");
const mongoose = require("mongoose");

exports.createTestUser = catchAsync(async (req, res) => {
  const { faces, name, id } = req.body; //Dang String

  // console.log(faces);

  //Xong xuôi rồi coi cái gì nữa

  // const stringFaces = JSON.stringify(faces);

  await UserInfoModel.create({
    _id: parseInt(id), //tạo 1 custom object id dựa trên id người dùng nhập vào
    name,
    faces,
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
