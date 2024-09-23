const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  img_url: { type: String, required: true },
  desc: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
