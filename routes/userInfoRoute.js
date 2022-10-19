const express = require("express");
const { createTestUser, getFacesById } = require("../controllers/userInfo");

const router = express.Router();

router.post("/new", createTestUser);
router.get("/:id", getFacesById);

module.exports = { router };
