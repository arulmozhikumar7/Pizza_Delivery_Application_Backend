const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.post("/addpizza", pizzaController.addpizza);

module.exports = router;
