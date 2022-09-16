const catchAsync = require("../middlewares/catchAsync");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// const fs = require("fs");

// const upload = require("../middlewares/upload");
// const dbConfig = require("../config/db");

// const MongoClient = require("mongodb").MongoClient;
// const GridFSBucket = require("mongodb").GridFSBucket;

// const url = dbConfig.url;

// const baseUrl = `${process.env.BASE_URL}/files/`;

// const mongoClient = new MongoClient(url);

exports.uploadFilesAvatar = catchAsync(async (req, res) => {
  const { avatar } = req.body; //Base64 type
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  const newBuffer = Buffer.from(avatar, "base64");
  await UserModel.findByIdAndUpdate(userId, {
    avatar: newBuffer,
  });

  res.json({
    success: true,
    message: "New avatar updated",
  });
});

exports.downloadUserAvatar = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new ApiError("User is not valid");
  }

  res.json({
    success: true,
    message: "Get user avatar success",
    payload: {
      avatar: user.avatar.toString("base64"),
    },
  });
});

exports.getUserByNameOrEmail = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  const userList =
    name.length === 0
      ? []
      : await UserModel.find({
          username: { $regex: ".*" + name + ".*", $options: "i" },
        }).exec();

  const userListByEmail =
    email.length === 0
      ? []
      : await UserModel.find({
          email: { $regex: ".*" + email + ".*", $options: "i" },
        }).exec();

  const lastResult = [...userList, ...userListByEmail].filter(
    (item) => item._id.toString() !== userId
  );

  res.json({
    success: true,
    message: "Found your friend",
    payload: lastResult,
  });
});
