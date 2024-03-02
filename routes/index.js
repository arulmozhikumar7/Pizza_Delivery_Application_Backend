const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const pizzaRoutes = require("./pizzaRoutes");
const ingredientRoutes = require("./ingredientRoutes");
router.use("/auth", authRoutes);
router.use("/pizza", pizzaRoutes);
router.use("/ingredient", ingredientRoutes);

module.exports = router;
