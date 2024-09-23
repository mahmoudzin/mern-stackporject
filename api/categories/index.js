const categoryModel = require("../../models/Category.js");
const GenricMethods = require("../../models/generic.js");
const QueryBuilder = require("../../models/QueryBuilder.js");
const asyncCatch = require("../../utilities/asyncCatch.js");
const AppError = require("../../utilities/appError.js");

const categoryMethods = new GenricMethods(categoryModel);

const getAllCategories = asyncCatch(async (req, res, next) => {
  const query = new QueryBuilder(categoryModel);
  const categories = await query.getAll();
  //pagination
  res.status(200).json({
    status: "success",
    count: categories.length,
    data: categories,
  });
});

// const getCategoryById = asyncCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const category = await categoryMethods.getById(id);

//   if (!category) {
//     const err = new AppError("this Category is not found");
//     err.status = "fail";
//     err.statusCode = 404;
//     throw err;
//   }

//   res.status(200).json({
//     status: "success",
//     product,
//   });
// });

// const createProduct = asyncCatch(async (req, res, next) => {
//   const category = await categoryMethods.getById(req.body.cat_id);
//   if (!category) {
//     throw new Error("Invalid Category ID");
//   }
//   const mainImage = req.files["main_image"]
//     ? `/images/products/${req.files["main_image"][0].filename}`
//     : null;
//   const images = req.files["images"]
//     ? req.files["images"].map((file) => `/images/products/${file.filename}`)
//     : [];

//   const data = {
//     ...req.body,
//     main_image: mainImage,
//     images,
//   };

//   const product = await productMethods.create(data, {
//     ref: "cat_id",
//     fields: ["title", "desc"],
//   });
//   res.status(200).json({
//     status: "success",
//     product,
//   });
// });
// const updateProduct = asyncCatch(async (req, res, next) => {
//   const productId = req.params.id;
//   const { body, files } = req;
//   const updatedData = body;
//   const product = await productMethods.getById(productId);
//   if (!product) {
//     throw new AppError("this Product is not found", 404);
//   }
//   if (files) {
//     if (files["main_mage"]) {
//       updatedData.main_image = `/images/products/${req.files["main_image"][0].filename}`;
//     }
//     if (files["images"]) {
//       updatedData.images = req.files["images"].map(
//         (file) => `/images/products/${file.filename}`
//       );
//     }
//   }

//   const updatedProduct = await productMethods.update(productId, updatedData, {
//     ref: "cat_id",
//     fields: ["title", "desc"],
//   });
//   res.status(200).json({
//     status: "success",
//     product: updatedProduct,
//   });
// });

// const deleteProduct = asyncCatch(async (req, res, next) => {
//   const productId = req.params.id;
//   const product = await productMethods.getById(productId);
//   if (!product) {
//     throw new AppError("this Product is not found", 404);
//   }
//   await productMethods.delete(productId);
//   res.status(200).json({
//     status: "success",
//     message: "Product deleted successfully",
//   });
// });

module.exports = {
  getAllCategories,
};
