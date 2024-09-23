const express = require("express");
const router = express.Router();
const productEndPoints = require("../../api/products");
const { uploadFiles } = require("../../controllers/product");

router.get("/products", productEndPoints.getAllProducts);
router.get("/products/:id", productEndPoints.getProductById);
router.post("/products", uploadFiles, productEndPoints.createProduct);
router.put("/products/:id", uploadFiles, productEndPoints.updateProduct);
router.delete("/products/:id", productEndPoints.deleteProduct);

module.exports = router;
