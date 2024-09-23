const express = require("express");
const router = express.Router();
const productsController = require("../controllers/product.js");
const base = "/products";

router.get(base, productsController.indexController);
router.get(`${base}/create`, productsController.createController);
router.post(
  `${base}/create`,
  productsController.uploadFiles,
  productsController.postController
);
module.exports = router;
