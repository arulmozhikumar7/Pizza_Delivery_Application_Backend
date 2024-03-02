const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pizza",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0, // Default quantity is 0
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
