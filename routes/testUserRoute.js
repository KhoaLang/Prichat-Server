const express = require("express");
const { createTestUser } = require("../controllers/testUser");

const router = express.Router();

router.post("/new", createTestUser);

module.exports = { router };
