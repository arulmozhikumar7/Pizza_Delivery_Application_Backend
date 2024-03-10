const Order = require("../models/Order");
const Cart = require("../models/cartModel");
const Pizza = require("../models/Pizza");
exports.createOrder = async (req, res) => {
  const { userId, firstname, lastname, email, address, city, postcode, zip } =
    req.body;

  const order = new Order({
    userId,
    firstname,
    lastname,
    email,
    address,
    city,
    postcode,
    zip,
  });
  await order.save();

  const cart = await Cart.findOne({ userId });
  cart.items = [];
  await cart.save();
  res.status(201).json({ message: "Order created successfully" });
};
exports.getOrders = async (req, res) => {
  try {
    // Fetch all orders from the database and populate the `items.pizza` field with the `name` from the `Pizza` model
    const orders = await Order.find().populate({
      path: "items.pizza",
      model: "Pizza",
      select: "name",
    });

    // Send the updated orders with populated pizza names
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
