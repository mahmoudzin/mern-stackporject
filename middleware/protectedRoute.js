const JWT = require("jsonwebtoken");
const { JWT_SECERT } = require("../controllers/user.js");
const GenericMethods = require("../models/generic.js");
const userModel = require("../models/User.js");

const userMethods = new GenericMethods(userModel);
async function protectedRoute(req, res, next) {
  try {
    //1- check token exist
    const token = req.cookies.token;
    //2- verify token is valid
    const { id } = JWT.verify(token, process.env.JWT_SECERT);
    //3- check if user still exist
    const user = await userMethods.getById(id);
    if (!user || user.role !== "admin") {
      res.status(401).render("error", {
        error: "401 Your are not authorized to access this Page.",
        back_url: "/register/signin",
      });
    }
    return next();
  } catch (e) {
    res.status(401).render("error", {
      error: "401 Your are not authorized to access this Page.",
      back_url: "/register/signin",
    });
  }
  //token => cookies
}

async function protectedApiRoute(req, res, next) {
  try {
    //1- check token exist
    let token = req.headers.authorization.split(" ")[1];
    //2- verify token is valid
    const { id } = JWT.verify(token, process.env.JWT_SECERT);
    //3- check if user still exist
    const user = await userMethods.getById(id);
    if (!user) {
      throw new AppError(
        "401 Your are not authorized to access this Page.",
        401
      );
    }
    return next();
  } catch (e) {
    next(e);
  }
  //token => cookies
}

module.exports = { protectedRoute, protectedApiRoute };
