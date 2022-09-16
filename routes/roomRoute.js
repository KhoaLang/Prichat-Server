const express = require("express");
const {
  getAllRoomIntroRelatedToCurrentUserId,
  createRoom,
  getRoomById,
  deleteRoom,
  leaveRoom,
  addMember,
} = require("../controllers/room");

const router = express.Router();

router.get("/", getAllRoomIntroRelatedToCurrentUserId);
router.get("/:roomId", getRoomById);
router.get("/leave/:roomId", leaveRoom);
router.post("/new", createRoom);
router.post("/add/:roomId", addMember);
router.delete("/:roomId", deleteRoom);

module.exports = { router };
