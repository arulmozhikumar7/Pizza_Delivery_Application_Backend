const Order = require("../models/Order");
const Cart = require("../models/Cart");

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
