const express = require("express");
const {
  createTimestamp,
  getLatestTimestamp,
} = require("../controllers/timestamp");

const router = express.Router();

router.post("/:id", createTimestamp);
router.get("/", getLatestTimestamp);

module.exports = { router };
