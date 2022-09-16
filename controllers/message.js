const catchAsync = require("../middlewares/catchAsync");
const MessageModel = require("../models/MessageModel");
const RoomModel = require("../models/RoomModel");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const fs = require("fs");

// const upload = require("../middleware/upload");
// const dbConfig = require("../config/db");

// const MongoClient = require("mongodb").MongoClient;
// const GridFSBucket = require("mongodb").GridFSBucket;

// const url = dbConfig.url;

// const baseUrl = "http://localhost:5000/files/";

// const mongoClient = new MongoClient(url);

exports.getAllMessageFromRoomId = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const messagesInRoom = await MessageModel.find({ room: roomId }).populate(
    "user",
    "_id username"
  );
  // .populate({
  //   path: "room",
  //   match: {_id: roomId}
  // }).exec();

  res.json({
    success: true,
    message: "Get messages success",
    payload: {
      messages: messagesInRoom,
    },
  });
});

exports.getLastestMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const lastestMess = await MessageModel.findOne({ room: roomId })
    .sort("-createdAt")
    .populate("user", "_id username")
    .exec();

  // console.log(lastestMess);

  res.json({
    success: true,
    message: "Get lastest messages success",
    payload: {
      lastestMess,
    },
  });
});

exports.newMessage = catchAsync(async (req, res) => {
  const { content, images, roomId } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(userId);
  const room = await RoomModel.findById(roomId);

  // const data = await fs.read(images)

  await MessageModel.create({
    user: user._id,
    content,
    room: room._id,
  });
  res.json({
    success: true,
    message: "Create new messages success",
  });
});

exports.eraseMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const message = await MessageModel.findByIdAndDelete(id);
  res.json({
    success: true,
    message: "Delete messages success",
  });
});
