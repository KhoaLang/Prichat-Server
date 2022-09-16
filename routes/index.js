const express = require("express");
const { router: authenticateRoute } = require("./authenticateRoute");
const { router: roomRoute } = require("./roomRoute");
const { router: userRoute } = require("./userRoute");
const { router: messageRoute } = require("./messageRoute");

const rootRouter = express.Router();

rootRouter.use("/auth", authenticateRoute);
rootRouter.use("/rooms", roomRoute);
rootRouter.use("/users", userRoute);
rootRouter.use("/messages", messageRoute);

module.exports = { rootRouter };
