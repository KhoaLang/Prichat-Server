require("dotenv").config();

const express = require("express");
const cors = require("cors");
const MessageModel = require("./models/MessageModel");
const connectDB = require("./config/mongodb");
const { rootRouter } = require("./routes");
const catchError = require("./middlewares/error");
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

connectDB();

app.use("/api", rootRouter);
app.use(catchError);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
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

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);

  socket.on("joinRoom", (data) => {
    // const { roomId } = data;
    socket.join(data);
    console.log(`Connected to room ${data} and socketId ${socket.id}`);
  });
  socket.on("leaveRoom", (data) => {
    // const { roomId } = data;
    socket.leave(data);
    console.log(`Leave room ${data} and socketId ${socket.id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { roomId, content, userId } = data;
    console.log("A message was emitted from fe room: " + roomId);
    const newMess = await MessageModel.create({
      user: mongoose.Types.ObjectId(userId),
      room: mongoose.Types.ObjectId(roomId),
      content,
    });
    await newMess.save();
    io.to(roomId).emit("receiveMessage", roomId);
  });
});
