const router = require("express").Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

//creating a user
router.route("/register").post(async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = await bcryptjs.hash(req.body.password, 10);

  const newUserData = {
    name,
    email,
    password,
  };

  const newUser = new User(newUserData);

  try {
    await newUser.save();
    return res.status(200).json({ message: "Created new User" });
  } catch (err) {
    return res.status(400).json({ message: "User with same email exists" });
  }
});

//login a user
router.route("/login").post(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", error: "Email doesn't exists" });
  }

  const isPasswordValid = await bcryptjs.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.SECRET
    );

    return res
      .status(200)
      .json({ status: "ok", user: token, name: user.name, email: user.email });
  } else {
    return res.status(400).json({ status: "error", user: false });
  }
});

//reset password
router.route("/update").post(async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const newPassword = await bcryptjs.hash(req.body.password, 10);

    await User.updateOne(
      { email: decoded.email },
      { $set: { password: newPassword } }
    );
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", error: "invalid token" });
  }
});

module.exports = router;
