const catchAsync = require("../middlewares/catchAsync");
const mongoose = require("mongoose");
const RoomModel = require("../models/RoomModel");
const UserModel = require("../models/UserModel");
const MessageModel = require("../models/MessageModel");
const jwt = require("jsonwebtoken");

exports.getAllRoomIntroRelatedToCurrentUserId = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const userInDB = await UserModel.findById(userId).select("-password");

    let roomsIntroList = await Promise.all(
      userInDB.roomIds.map(async (item) => {
        return await RoomModel.findById(item).select("-messages");
      })
    );

    res.json({
      success: true,
      message: "Fetch room successfully",
      payload: {
        rooms: [...roomsIntroList],
      },
    });
  } catch (err) {
    console.log(err);
  }
});
exports.getRoomById = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  try {
    const roomDetail = await RoomModel.findById(roomId);
    res.json({
      success: true,
      message: "Fetch room successfully",
      payload: {
        roomMessages: roomDetail,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

exports.createRoom = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { roomname, avatar, friendIds } = req.body;
  //FriendIds is an array of userId, which we want to invite
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  if (!roomname) {
    res.status(400).json({
      success: false,
      message: "Missing Roomname",
    });
  } else if (friendIds.length < 1) {
    res.status(400).json({
      success: false,
      message: "You have to invite at least one friend",
    });
  }

  const friendListInUserObject = await Promise.all(
    [...friendIds, userId].map(async (item) => {
      let temp = await UserModel.findById(item).select("-password");
      return temp._id;
    })
  );
  // console.log(friendIds);
  // console.log(friendListInUserObject);
  const newRoom = await RoomModel({
    roomname,
    avatar,
    members: friendListInUserObject,
  });

  // console.log(members);

  newRoom.save(async function (err) {
    if (!err) {
      await Promise.all(
        [...friendIds, userId].map(async (item) => {
          let temp = await UserModel.findByIdAndUpdate(item, {
            $push: { roomIds: newRoom._id },
          });
          return null;
        })
      );
    }
  });

  res.json({
    success: true,
    message: "Successfully created new room!",
    payload: {
      room: newRoom,
    },
  });
});

exports.deleteRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const result = await RoomModel.findByIdAndDelete(roomId);
  const roomIdObj = mongoose.Types.ObjectId(roomId);
  const removeMess = await MessageModel.deleteMany({ room: roomIdObj });

  res.json({
    success: true,
    message: "Successfully delete room!",
  });
});

exports.leaveRoom = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  const { roomId } = req.params;

  const userRoomIds = await UserModel.findById(userId).select("roomIds");
  await UserModel.findByIdAndUpdate(userId, {
    $set: {
      roomIds: [...userRoomIds.roomIds.filter((item) => item !== roomId)],
    },
  });

  const memebersInRoom = await RoomModel.findById(roomId).select("members");
  await RoomModel.findByIdAndUpdate(roomId, {
    $set: {
      members: [
        ...memebersInRoom.members.filter(
          (item) => !item.equals(mongoose.Types.ObjectId(userId))
        ),
      ],
    },
  });

  res.json({
    success: true,
    message: "Leave room successfully",
  });
});

exports.addMember = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { userIdWantToAdd } = req.body;

  const userRoomIds = await UserModel.findById(userIdWantToAdd).select(
    "roomIds"
  );
  await UserModel.findByIdAndUpdate(userIdWantToAdd, {
    $set: {
      roomIds: [...userRoomIds.roomIds, roomId],
    },
  });

  const memebersInRoom = await RoomModel.findById(roomId).select("members");
  await RoomModel.findByIdAndUpdate(roomId, {
    $set: {
      members: [
        ...memebersInRoom.members,
        mongoose.Types.ObjectId(userIdWantToAdd),
      ],
    },
  });

  res.json({
    success: true,
    message: "Add members to room successfully",
  });
});
