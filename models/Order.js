const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstname: String,
  lastname: String,
  email: String,
  address: String,
  city: String,
  zip: Number,
  notes: { type: String, default: "" },
  items: [
    {
      pizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pizza",
      },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["received", "inKitchen", "sentToDelivery", "delivered"],
    default: "received",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
