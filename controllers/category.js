const categoryModel = require("../models/Category.js");
const productModel = require("../models/Product.js");
const ModelGeneric = require("../models/generic.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

//multer configs

//mutler stoarge //How
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/category");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `category-${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage: multerStorage,
});

const uploadPhoto = uploader.single("img_url");

const modelMethods = new ModelGeneric(categoryModel);
const productMethods = new ModelGeneric(productModel);

const indexController = async (req, res) => {
  const categories = await modelMethods.getAll();
  res.status(200).render("categories", { categories });
};

const createController = async (req, res) => {
  res.status(200).render("categories/create");
};

const postController = async (req, res) => {
  // console.log(req.body);
  const data = {
    ...req.body,
    img_url: `/images/category/${req.file.filename}`,
  };

  await modelMethods.create(data);
  res.redirect("/categories");
};

const viewSingleCategory = async (req, res) => {
  const categoryId = req.params.id;
  // Fetch the category by its ID
  const category = await modelMethods.getById(categoryId);

  // Fetch products associated with this category
  const products = await productMethods.getAll(
    { cat_id: categoryId },
    { ref: "cat_id", fields: ["title"] }
  );
  res.status(200).render("categories/view", { category, products });
};

const renderUpdatePage = async (req, res) => {
  const categoryId = req.params.id;
  // Fetch the category by its ID
  const category = await modelMethods.getById(categoryId);

  // Fetch products associated with this category

  res.status(200).render("categories/update", { category });
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { title, desc } = req.body;
  const updatedData = { title, desc };
  // Handle image upload if a new image is provided
  if (req.file) {
    updatedData.img_url = `/images/category/${req.file.filename}`;
  }
  // Update the category in the database
  await modelMethods.update(categoryId, updatedData);

  res.redirect(`/categories`);
};

const deletePage = async (req, res) => {
  const categoryId = req.params.id;
  await modelMethods.delete(categoryId);
  await productModel.deleteMany({ cat_id: categoryId });
  res.redirect("/categories");
};
module.exports = {
  uploadPhoto,
  indexController,
  createController,
  postController,
  viewSingleCategory,
  renderUpdatePage,
  updateCategory,
  deletePage,
};
