require("dotenv").config();
const express = require("express");
const cors = require("cors");
const MessageModel = require("./models/MessageModel");
const connectDB = require("./config/mongodb");
const { rootRouter } = require("./routes");
const catchError = require("./middlewares/error");
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/UserModel");
const RoomModel = require("./models/RoomModel");
const { updateSeendUser } = require("./controllers/room");

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use("/api", rootRouter);
app.use(catchError);

const server = app.listen(3002, () => {
  console.log(`Server is running on ${process.env.PORT || 3002}`);
});

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    socket.userId = socket.handshake.query.userId;
    next();
  } catch (err) {
    console.log(err);
  }
});
app.locals.io = io;
io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);
  socket.on("joinRoom", async (data) => {
    const { roomId, usrId } = data;
    socket.join(roomId);
    console.log(`Connected to room ${roomId} and socketId ${socket.id}`);

    const room = await RoomModel.findById(roomId);
    room?.seened.length > 0
      ? room?.seened.every(async (item, idx) => {
          if (
            !item.toString().includes(usrId) &&
            idx === room?.seened.length - 1
          ) {
            await RoomModel.updateOne(
              { _id: roomId },
              { $push: { seened: new mongoose.Types.ObjectId(usrId) } }
            );
          } else if (item.toString().includes(usrId)) {
            return false;
          }
          return true;
        })
      : await RoomModel.updateOne(
          { _id: roomId },
          { $push: { seened: new mongoose.Types.ObjectId(usrId) } }
        );

    // console.log(io.sockets.adapter.rooms.get(`${data}`));
  });

  socket.on("leaveRoom", async (data) => {
    const { roomId, usrId } = data;
    // socket.leave(roomId);
    console.log(`Leave room ${roomId} and socketId ${socket.id}`);

    const room = await RoomModel.findById(roomId);

    if (room?.seened.length > 0) {
      let res = await RoomModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(roomId),
        },
        {
          $set: {
            seened: [
              ...room?.seened.filter((item) => item.toString() !== usrId),
            ],
          },
        }
      );
    }
  });

  socket.on("sendMessage", async (data) => {
    const { roomId, content, userId } = data;
    // console.log("A message was emitted from fe room: " + roomId);
    const newMess = await MessageModel.create({
      user: mongoose.Types.ObjectId(userId),
      room: mongoose.Types.ObjectId(roomId),
      content,
    });

    const room = await RoomModel.findById(roomId);
    let usrsPresentingInRoom = room.seened;

    const userTemp = await UserModel.findById(userId);

    let res = room.members.filter((item, idx) => {
      let flag = 0;
      let temp = [];
      usrsPresentingInRoom.every((item2) => {
        if (item.toString() === item2.toString()) {
          flag = 1;
          return false;
        } else {
          temp = [...temp, item2.toString()];
        }
        return true;
      });
      usrsPresentingInRoom = temp;

      if (flag === 1) {
        return false;
      } else if (flag === 0) {
        return true;
      }
    });

    //Trả về 1 danh sách unseen các user không có trong phòng chat, sẽ gwri thông báo cho các user đó
    let resMess = {
      _id: newMess._id.toString(),
      user: {
        _id: userTemp._id.toString(),
        username: userTemp.username.toString(),
      },
      room: newMess.room.toString(),
      content: newMess.content,
      images: newMess.images,
      createdAt: newMess.createdAt,
      unseen: res,
      roomId,
    };

    io.in(roomId).emit("receiveMessage", resMess);
  });

  socket.on("typing", (roomAndid) =>
    socket.broadcast.to(roomAndid.room).emit("typing", roomAndid.id)
  );
  socket.on("stop-typing", (roomAndid) =>
    io.in(roomAndid.room).emit("stop-typing", roomAndid.id)
  );
});
