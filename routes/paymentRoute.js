const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.createPayment);
router.post("/verify", paymentController.confirmPayment);
module.exports = router;
