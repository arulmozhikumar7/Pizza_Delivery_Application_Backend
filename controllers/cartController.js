const { Cart, CartItem } = require("../models/cartModel");

// Controller to add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userid, pizzaId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userid });

    if (!cart) {
      cart = new Cart({ user: userid, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.pizza.toString() === pizzaId
    );

    if (existingItem) {
      // If the item exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({ pizza: pizzaId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to remove an item from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { pizzaId, userId } = req.params; // Retrieve userId from request params

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(userId);
    console.log(pizzaId);
    // Find the index of the item in the cart items array
    const itemIndex = cart.items.findIndex(
      (item) => item.pizza.toString() === pizzaId
    );
    console.log(itemIndex);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", cart });
    console.log("Item removed from cart successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get the contents of the cart
exports.getCartContents = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming user ID is available in req.user

    let cart = await Cart.findOne({ user: userId }).populate("items.pizza");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.reduceItemQuantity = async (req, res) => {
  try {
    const { pizzaId, userId } = req.params; // Retrieve userId and itemId from request params

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find((item) => item.pizza.toString() === pizzaId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Decrease the quantity of the item by 1
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      // If the quantity is already 1, do nothing
      return res
        .status(200)
        .json({ message: "Item quantity is already at minimum" });
    }

    await cart.save();

    res
      .status(200)
      .json({ message: "Item quantity reduced successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.increaseItemQuantity = async (req, res) => {
  try {
    const { pizzaId, userId } = req.params; // Retrieve userId and pizzaId from request params

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find((item) => item.pizza.toString() === pizzaId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Increase the quantity of the item
    item.quantity++;

    await cart.save();

    res
      .status(200)
      .json({ message: "Item quantity increased successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteCart = async (req, res) => {
  try {
    const { userId } = req.params; // Retrieve userId from request params

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.calculateTotalAmount = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find the cart associated with the user ID and populate the items with pizza details
    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Initialize total amount
    let totalAmount = 0;

    // Iterate through each item in the cart
    for (const item of cart.items) {
      // Multiply the quantity of the item by its price and add to total amount
      totalAmount += item.quantity * item.pizza.price;
    }

    // Return the total amount
    console.log("Total Amount:", totalAmount);
    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to calculate total amount");
  }
};
