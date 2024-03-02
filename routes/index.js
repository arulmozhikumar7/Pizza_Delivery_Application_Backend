const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const pizzaRoutes = require("./pizzaRoutes");
const ingredientRoutes = require("./ingredientRoutes");
const inventoryRoutes = require("./inventoryRoutes");
router.use("/auth", authRoutes);
router.use("/pizza", pizzaRoutes);
router.use("/ingredient", ingredientRoutes);
router.use("/inventory", inventoryRoutes);

module.exports = router;
