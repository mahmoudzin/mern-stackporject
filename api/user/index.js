const JWT = require("jsonwebtoken");
const GenricMethods = require("../../models/generic.js");
const userModel = require("../../models/User.js");
const bcrypt = require("bcryptjs");
const AppError = require("../../utilities/appError.js");
const asyncCatch = require("../../utilities/asyncCatch.js");
const userMethods = new GenricMethods(userModel);
const crypto = require("crypto");

const EXPIRES_IN = "90d";

const createUser = asyncCatch(async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await userMethods.create(req.body);
  //create JWT
  //key - message
  // i0iii2v4
  // 123456
  const token = JWT.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECERT,
    {
      expiresIn: EXPIRES_IN,
    }
  );

  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

const logIn = asyncCatch(async (req, res, next) => {
  //get User by email

  const user = await userModel.findOne({ email: req.body.email });
  //check Password match Form pasword
  if (!user) {
    throw new AppError("this email is not exists", 404);
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch)
    throw new AppError(
      "There seems to be an issue with either your email or your password.",
      401
    );

  //create JWT
  const token = JWT.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECERT,
    {
      expiresIn: EXPIRES_IN,
    }
  );
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

const forgetPassword = asyncCatch(async (req, res, next) => {
  //1 -check user is exist
  const user = await userModel.findOne({ email: req.body.email });
  //check Password match Form pasword
  if (!user) {
    throw new AppError("this email is not exists", 400);
  }
  //2- generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set it on the user model
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

  const updatedUser = await user.save({ validateBeforeSave: false });
  //3- send token to user's email.
  //Nodemailer

  res.status(200).json({
    status: "success",
    message: "the token has been send to the email successfully",
  });
});

module.exports = {
  createUser,
  logIn,
  forgetPassword,
};
