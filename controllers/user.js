const JWT = require("jsonwebtoken");
const GenricMethods = require("../models/generic.js");
const userModel = require("../models/User.js");
const bcrypt = require("bcryptjs");
const userMethods = new GenricMethods(userModel);

const EXPIRES_IN = "90d";

const renderSingUp = async (req, res) => {
  res.status(200).render("register/signup");
};

const createUser = async (req, res) => {
  req.body.password = await bcrypt.hash(this.password, 12);
  const user = await userMethods.create(req.body);
  //create JWT
  const token = JWT.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECERT,
    {
      expiresIn: EXPIRES_IN,
    }
  );
  res.cookie("token", token);
  //cookie-parser
  res.status(200).redirect("/");
};

const renderSingIn = async (req, res) => {
  res.status(200).render("register/signin");
};

const logIn = async (req, res) => {
  //get User by email
  const user = await userModel.findOne({ email: req.body.email });

  // console.log(user);
  //check Password match Form pasword
  if (!user) {
    return res.status(404).render("error", {
      error: "This email does not exist!",
      back_url: "/register/signin",
    });
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch)
    return res.status(400).render("error", {
      error:
        "There seems to be an issue with either your email or your password.",
      back_url: "/register/signin",
    });

  //create JWT
  const token = JWT.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECERT,
    {
      expiresIn: EXPIRES_IN,
    }
  );
  res.cookie("token", token).status(200).redirect("/");
};
module.exports = {
  renderSingUp,
  renderSingIn,
  createUser,
  logIn,
};
