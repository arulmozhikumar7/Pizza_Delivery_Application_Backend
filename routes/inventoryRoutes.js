const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/getinventory", inventoryController.getInventoryStatus);
router.post("/updateinventory", inventoryController.addPizzaToInventory);
module.exports = router;
