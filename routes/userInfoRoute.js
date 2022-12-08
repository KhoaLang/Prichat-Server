const express = require("express");
const { createTestUser, updateUserTime } = require("../controllers/userInfo");

const router = express.Router();

router.post("/", createTestUser);
router.patch("/", updateUserTime);

module.exports = { router };
