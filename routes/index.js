const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const pizzaRoutes = require("./pizzaRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoute");
router.use("/auth", authRoutes);
router.use("/pizza", pizzaRoutes);

router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes);
router.use("/order", orderRoutes);

module.exports = router;
