const Razorpay = require("razorpay");
const { Cart, CartItem } = require("../models/cartModel");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Order = require("../models/Order");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "arulmozhikumar7@gmail.com",
    pass: "tvkImS8MV4WX9qdH",
  },
});
const createRazorpayOrder = async (amount) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_1RKKP5rJBqKpT4",
    key_secret: "X8BlADZRIipZaJXpTtKfR8yu",
  });
  const options = {
    amount: amount,
    currency: "INR",
    receipt: shortid.generate(),
  };
  return razorpay.orders.create(options);
};

exports.createPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");
    if (!cart) {
      // Handle the case where the cart is not found
      res.status(404).json({ message: "Cart not found" });
      console.log("Cart not found");
      return;
    }
    let amount = 0;
    for (const item of cart.items) {
      // Multiply the quantity of the item by its price and add to total amount
      amount += item.quantity * item.pizza.price;
    }
    amount *= 100;

    // Create Razorpay order
    const order = await createRazorpayOrder(amount);
    res.json({ orderId: order.id, amount: amount });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.confirmPayment = async (req, res) => {
  try {
    const {
      payment_id,
      userId,
      firstname,
      lastname,
      email,
      address,
      city,
      zip,
      notes,
      items,
      totalAmount,
    } = req.body;

    const payment = await verifyPayment(payment_id);
    if (payment.status === "captured") {
      // Payment successful

      // Populate pizza names for each item

      // Create new order
      const order = new Order({
        userId,
        firstname,
        lastname,
        email,
        address,
        city,
        zip,
        notes,
        totalAmount: payment.amount / 100,
        status: "inKitchen",
        items,
      });

      // Save order to database
      await order.save();
      const amount = payment.amount / 100;
      // Clear cart items
      const cart = await Cart.findOne({ user: userId });
      cart.items = [];
      await cart.save();

      // Send order details to user email
      const mailOptions = {
        from: "arulmozhikumar7@gmail.com",
        to: email,
        subject: "Order Confirmation",
        html: `<p>Thank you for your order!</p>
               <p>Here are your order details:</p>
               
               <p>Total Amount: ₹${amount}</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.status(200).json({ message: "Payment successful" });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyPayment = async (paymentId) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_1RKKP5rJBqKpT4",
    key_secret: "X8BlADZRIipZaJXpTtKfR8yu",
  });
  return razorpay.payments.fetch(paymentId);
};
