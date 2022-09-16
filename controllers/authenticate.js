const UserModel = require("../models/UserModel");
const catchAsync = require("../middlewares/catchAsync");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.register = catchAsync(async (req, res) => {
  // console.log("hellos");
  const { username, password, email, dateOfBirth } = req.body;
  const findUsernameInDB = await UserModel.findOne({ username });
  if (findUsernameInDB === username) {
    return res
      .status(400)
      .json({ success: false, message: "Username is already taken!" });
  }

  const hashedPassword = await argon2.hash(password);

  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
    email,
    dateOfBirth,
  });

  const access_token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.JWT_SECRET
  );

  res.json({
    success: true,
    message: "Successfully created new user!",
    accessToken: access_token,
    user: {
      id: newUser._id,
      username,
      email,
      dateOfBirth,
    },
  });
});

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const findUsernameInDB = await UserModel.findOne({ username });
    if (!findUsernameInDB) {
      return res
        .status(400)
        .json({ success: false, message: "You didn't create an account yet!" });
    }

    const validatePassword = await argon2.verify(
      findUsernameInDB.password,
      password
    );
    if (!validatePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });
    }
    // console.log(findUsernameInDB);
    const accessToken = jwt.sign(
      { userId: findUsernameInDB._id },
      process.env.JWT_SECRET
    ); //._id được tạo sẵn trong mongoDB

    res.json({
      success: true,
      message: "Successfully logined!",
      accessToken,
      user: {
        id: findUsernameInDB._id,
        username: findUsernameInDB.username,
        email: findUsernameInDB.email,
        dateOfBirth: findUsernameInDB.dateOfBirth,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

exports.me = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  const userInDB = await UserModel.findById(userId).select("-password");
  res.json({
    success: true,
    message: "Fetch user success!",
    accessToken: token,
    user: {
      email: userInDB.email,
      username: userInDB.username,
      id: userInDB._id,
      dateOfBirth: userInDB.dateOfBirth,
    },
  });
});
