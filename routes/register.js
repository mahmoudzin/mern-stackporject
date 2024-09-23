const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

router.get("/register/signup", userController.renderSingUp);
router.get("/register/signin", userController.renderSingIn);
router.post("/register/signup", userController.createUser);
router.post("/register/signin", userController.logIn);
module.exports = router;
