const express = require("express");
const { register, me, login } = require("../controllers/authenticate");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

module.exports = { router };
