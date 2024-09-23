const express = require("express");

const router = express.Router();
const categoriesController = require("../controllers/category.js");
const base = "/categories";

//destination
router.get(base, categoriesController.indexController);
router.get(`${base}/create`, categoriesController.createController);
router.get(`${base}/:id/view`, categoriesController.viewSingleCategory);
router.get(`${base}/:id/update`, categoriesController.renderUpdatePage);
router.get(`${base}/:id/delete`, categoriesController.deletePage);
router.post(
  `${base}/create`,
  categoriesController.uploadPhoto,
  categoriesController.postController
);
router.post(
  `${base}/:id/update`,
  categoriesController.uploadPhoto,
  categoriesController.updateCategory
);

module.exports = router;
