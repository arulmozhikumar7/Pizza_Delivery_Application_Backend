const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders);
router.put("/:orderId", orderController.updateOrderStatus);
module.exports = router;
