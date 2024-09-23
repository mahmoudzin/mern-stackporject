const express = require("express");
const router = express.Router();
const productRouter = require("./products.js");

const homeController = require("../controllers/index.js");

router.get("/", homeController);

module.exports = router;
