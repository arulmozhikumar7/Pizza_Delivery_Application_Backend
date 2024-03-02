const Inventory = require("../models/Inventory");

// Function to update inventory when a pizza is added
exports.updateInventoryOnPizzaAdd = async (req, res) => {
  try {
    const { pizzaId, quantity } = req.body;
    const inventoryItem = await Inventory.findOne({ pizza: pizzaId });
    if (inventoryItem) {
      // If the pizza is already in inventory, increment its quantity
      inventoryItem.quantity += 1; // Assuming one pizza is added at a time
      await inventoryItem.save();
    } else {
      // If the pizza is not in inventory, create a new inventory item
      const newInventoryItem = new Inventory({
        pizza: pizzaId,
        quantity, // Assuming one pizza is added at a time
      });
      await newInventoryItem.save();
    }
    res.status(200).json({ message: "Inventory updated successfully" });
    console.log("Inventory updated successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error("Error updating inventory:", err.message);
  }
};

// Function to get current inventory status
exports.getInventoryStatus = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("pizza");
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
