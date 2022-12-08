const express = require("express");
const {
  getAllRoomIntroRelatedToCurrentUserId,
  createRoom,
  getRoomById,
  deleteRoom,
  leaveRoom,
  addMember,
  updateSeendUser,
  removeUnseenUser,
} = require("../controllers/room");

const router = express.Router();

router.get("/", getAllRoomIntroRelatedToCurrentUserId);
router.get("/:roomId", getRoomById);
router.get("/leave/:roomId", leaveRoom);
router.post("/new", createRoom);
router.post("/add/:roomId", addMember);
router.post("/updateSeenUser/:roomId", updateSeendUser);
router.delete("/:roomId", deleteRoom);
router.get("/removeUnseen/:usrId", removeUnseenUser);

module.exports = { router };
