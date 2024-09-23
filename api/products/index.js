const productModel = require("../../models/Product.js");
const categoryModel = require("../../models/Category.js");
const GenricMethods = require("../../models/generic.js");
const QueryBuilder = require("../../models/QueryBuilder.js");
const asyncCatch = require("../../utilities/asyncCatch.js");
const AppError = require("../../utilities/appError.js");

const productMethods = new GenricMethods(productModel);
const categoryMethods = new GenricMethods(categoryModel);
//class
const getAllProducts = asyncCatch(async (req, res, next) => {
  const { cat_id, min_stock, max_stock, min_price, max_price } = req.query;

  let filters = {};
  if (cat_id) {
    const category = await categoryMethods.getById(cat_id);
    if (category) {
      filters.cat_id = cat_id;
    } else {
      // prettier-ignore
      return res.status(404).json({ status: 404, message: "This category is not found" });
    }
  }
  if (min_stock && !max_stock) {
    filters.stock = { $gt: min_stock };
  } else if (max_stock && !min_stock) {
    filters.stock = { $lt: max_stock };
  } else if (min_stock && max_stock) {
    filters.stock = { $gt: min_stock, $lt: max_stock };
  }
  if (min_price && !max_price) {
    filters.price = { $gt: min_price };
  } else if (max_price && !min_price) {
    filters.price = { $lt: max_price };
  } else if (min_price && max_price) {
    filters.price = { $gt: min_price, $lt: max_price };
  }

  const query = new QueryBuilder(productModel, req.query);
  const products = await query
    .filter(filters)
    .populate("cat_id", ["title", "desc"])
    .sorting()
    .search()
    .customizeFields()
    .pagination()
    .getAll();

  const pages = await query.countAllPages();
  //pagination
  res.status(200).json({
    status: "success",
    count: products.length,
    pages,
    data: products,
  });
});

const getProductById = asyncCatch(async (req, res, next) => {
  const product = await productMethods.getById(req.params.id, {
    ref: "cat_id",
    fields: ["title", "desc"],
  });

  if (!product) {
    const err = new Error("this Product is not found");
    err.status = "fail";
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

const createProduct = asyncCatch(async (req, res, next) => {
  const category = await categoryMethods.getById(req.body.cat_id);
  if (!category) {
    throw new Error("Invalid Category ID");
  }
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

  const product = await productMethods.create(data, {
    ref: "cat_id",
    fields: ["title", "desc"],
  });
  res.status(200).json({
    status: "success",
    product,
  });
});
const updateProduct = asyncCatch(async (req, res, next) => {
  const productId = req.params.id;
  const { body, files } = req;
  const updatedData = body;
  const product = await productMethods.getById(productId);
  if (!product) {
    throw new AppError("this Product is not found", 404);
  }
  if (files) {
    if (files["main_mage"]) {
      updatedData.main_image = `/images/products/${req.files["main_image"][0].filename}`;
    }
    if (files["images"]) {
      updatedData.images = req.files["images"].map(
        (file) => `/images/products/${file.filename}`
      );
    }
  }

  const updatedProduct = await productMethods.update(productId, updatedData, {
    ref: "cat_id",
    fields: ["title", "desc"],
  });
  res.status(200).json({
    status: "success",
    product: updatedProduct,
  });
});

const deleteProduct = asyncCatch(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productMethods.getById(productId);
  if (!product) {
    throw new AppError("this Product is not found", 404);
  }
  await productMethods.delete(productId);
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
