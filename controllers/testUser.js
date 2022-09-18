const catchAsync = require("../middlewares/catchAsync");
const TestUserModel = require("../models/TestUserModel");

exports.createTestUser = catchAsync(async (req, res) => {
  const { face1, face2, face3, name } = req.body;

  console.log(name);

  await TestUserModel.create({
    name,
    face1,
    face2,
    face3,
  });

  res.json({
    success: true,
    message: "Create new user success",
  });
});
