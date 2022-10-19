const catchAsync = require("../middlewares/catchAsync");
const TestUserSchema = require("../models/TestUserModel");
const mongoose = require("mongoose");

exports.createTestUser = catchAsync(async (req, res) => {
  const { faces, name, id } = req.body; //Dang String

  console.log(faces);

  //Xong xuôi rồi coi cái gì nữa

  const stringFaces = JSON.stringify(faces);

  await TestUserSchema.create({
    _id: parseInt(id), //tạo 1 custom object id dựa trên id người dùng nhập vào
    name,
    faces: stringFaces,
  });

  res.json({
    success: true,
    message: "Create new user success",
  });
});

exports.getUser = catchAsync(async (req, res) => {
  // const { id } = req.params; //id là các mssv
  const data = await TestUserSchema.find({});

  res.json({
    success: true,
    message: "Retrieve faces success",
    payload: data,
  });
});