// cartRoutes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Route to add an item to the cart
router.post("/add", cartController.addToCart);

// Route to remove an item from the cart
router.delete(
  "/remove/:pizzaId/:userId",

  cartController.removeFromCart
);

router.put("/reduce/:pizzaId/:userId", cartController.reduceItemQuantity);
router.put("/increase/:pizzaId/:userId", cartController.increaseItemQuantity);
// Route to get the contents of the cart
router.get("/", cartController.getCartContents);

router.delete("/delete/:userId", cartController.deleteCart);

module.exports = router;
