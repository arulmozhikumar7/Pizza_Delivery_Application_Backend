const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.post("/addpizza", pizzaController.addpizza);
router.get("/getpizzas", pizzaController.getallPizza);
module.exports = router;
