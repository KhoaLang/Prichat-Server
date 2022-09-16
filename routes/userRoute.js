const express = require("express");
const {
  getUserByNameOrEmail,
  uploadFilesAvatar,
  downloadUserAvatar,
} = require("../controllers/users");

const router = express.Router();

router.post("/", getUserByNameOrEmail);
router.post("/avatar", uploadFilesAvatar);
router.get("/avatar", downloadUserAvatar);

module.exports = { router };
