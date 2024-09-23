const productModel = require("../models/Product.js");
const categoryModel = require("../models/Category.js");
const ModelGeneric = require("../models/generic.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const modelMethods = new ModelGeneric(productModel);
const catMethods = new ModelGeneric(categoryModel);
//config multer
//mutler stoarge //How
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/products");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage: multerStorage,
});

const uploadFiles = uploader.fields([
  { name: "main_image", maxCount: 1 },
  { name: "images", maxCount: 12 },
]);
// uploader.("main_image");

const indexController = async (req, res) => {
  const products = await modelMethods.getAll(
    {},
    { ref: "cat_id", fields: ["title"] },
    true
  );

  res.status(200).render("products", { products });
};
const createController = async (req, res) => {
  const categories = await catMethods.getAll();
  res.status(200).render("products/create", { categories });
};

const postController = async (req, res) => {
  const mainImage = req.files["main_image"]
    ? `/images/products/${req.files["main_image"][0].filename}`
    : null;
  const images = req.files["images"]
    ? req.files["images"].map((file) => `/images/products/${file.filename}`)
    : [];

  const data = {
    ...req.body,
    main_image: mainImage,
    images,
  };
  // const { title, description, stock, expired } = req.body;
  await modelMethods.create(data);
  res.redirect("/products");
};

module.exports = {
  indexController,
  createController,
  postController,
  uploadFiles,
};
