const express = require("express");
const router = express.Router();
const userEndPoints = require("../../api/user");

router.post("/signup", userEndPoints.createUser);
router.post("/login", userEndPoints.logIn);
router.post("/forgetpass", userEndPoints.forgetPassword);

module.exports = router;
