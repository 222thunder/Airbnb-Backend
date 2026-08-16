const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  housePrice: { type: Number, required: true },
  houseLocation: { type: String, required: true },
  houseRating: { type: Number, required: true },
  photo: { type: String, required: true },
  houseDescription: String,
});

module.exports = mongoose.model("Home", homeSchema);
