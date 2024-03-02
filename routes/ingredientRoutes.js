const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

router.post("/addingredient", ingredientController.addIngredient);

module.exports = router;
