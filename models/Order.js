const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: ObjectId,
  items: [{ pizzaId: ObjectId, quantity: Number, price: Number }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["received", "inKitchen", "sentToDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
