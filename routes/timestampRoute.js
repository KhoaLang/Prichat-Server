const express = require("express");
const { createTimestamp } = require("../controllers/timestamp");

const router = express.Router();

router.post("/:id", createTimestamp);

module.exports = { router };
