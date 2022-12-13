const express = require("express");
const {
  createUser,
  getUserInfoById,
  updateUserEnterTime,
  updateUserLeaveTime,
} = require("../controllers/userInfo");

const router = express.Router();

router.get("/:id", getUserInfoById);
router.post("/", createUser);
router.patch("/enter/:id", updateUserEnterTime);
router.patch("/leave/:id", updateUserLeaveTime);

module.exports = { router };
