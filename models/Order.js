const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  address: { type: String, required: true },
  traking_phonenumber: { type: String, required: true },
  payment_method: { type: String, required: true },
  status: { type: String, required: true },
  total_price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
