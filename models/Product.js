const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "this field is required"],
    minLength: [5, "this field must be at least 5 characters"],
    maxlength: [40, "this field must be at most 40 characters"],
  },
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  main_image: { type: String, required: true },
  images: [{ type: String }],
  description: {
    type: String,
    required: true,
    maxlength: [255, "this field must be at most 255 characters"],
    minlength: [30, "this field must be at least 30 characters"],
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: "this field must be more than 1",
    },
  },
  // proprties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  stock: {
    type: Number,
    required: true,
    min: [0, "this field must be at least 0"],
  },
  expired: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > new Date();
      },
      message: "Expired date must be today or in the future.",
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
