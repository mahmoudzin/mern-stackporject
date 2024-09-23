const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
