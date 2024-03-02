const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["base", "sauce", "cheese", "topping", "meat"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
