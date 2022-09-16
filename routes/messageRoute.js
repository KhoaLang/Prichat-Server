const express = require("express");
const {
  getAllMessageFromRoomId,
  newMessage,
  eraseMessage,
  getLastestMessage,
} = require("../controllers/message");

const router = express.Router();

router.get("/:roomId", getAllMessageFromRoomId);
router.get("/lastestMessage/:roomId", getLastestMessage);
router.post("/newMessage", newMessage);
router.delete("/:id", eraseMessage);
module.exports = { router };
