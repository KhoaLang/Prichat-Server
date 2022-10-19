const express = require("express");
const { createTestUser, getUser } = require("../controllers/testUser");

const router = express.Router();

router.post("/new", createTestUser);
router.get("/", getUser);

module.exports = { router };