const mongoose = require("mongoose");

const userReactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proudct_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  comment: { type: String },
  rate: { type: Number, required: true },
});

const UserReact = mongoose.model("UserReact", userReactSchema);

module.exports = UserReact;
