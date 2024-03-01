const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  Ingredients: [
    {
      name: String,
      type: String,
    },
  ],
});
const Pizza = mongoose.model("Pizza", pizzaSchema);
module.exports = Pizza;
