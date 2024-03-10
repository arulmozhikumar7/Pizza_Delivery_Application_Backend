const Pizza = require("../models/Pizza");
const Inventory = require("../models/Inventory");
const Ingredient = require("../models/Ingredient");

async function addPizzaToInventory(req, res) {
  const { pizzaId, quantity } = req.body;

  try {
    // Check if pizza exists
    const pizza = await Pizza.findById(pizzaId).populate("ingredients");

    if (!pizza) {
      return res.status(404).json({ error: "Pizza not found" });
    }

    // Check ingredient availability
    const insufficientIngredient = await checkIngredientsAvailability(
      pizza.ingredients,
      quantity
    );

    // If any ingredient is insufficient, return an error message
    if (insufficientIngredient) {
      return res.status(400).json({
        error: `Insufficient quantity of ${insufficientIngredient.name}`,
      });
    }

    // Check if pizza already exists in inventory
    let inventoryEntry = await Inventory.findOne({ pizza: pizzaId });

    // If pizza doesn't exist in inventory, create a new entry
    if (!inventoryEntry) {
      inventoryEntry = new Inventory({
        pizza: pizzaId,
        quantity: quantity,
      });
    } else {
      // If pizza already exists in inventory, update quantity
      inventoryEntry.quantity += quantity;
    }

    // Save or update inventory entry
    await inventoryEntry.save();

    // Update ingredient quantities
    await updateIngredientQuantities(pizza.ingredients, quantity);

    res.status(201).json({ message: "Pizza added to inventory successfully" });
  } catch (error) {
    console.error("Error adding pizza to inventory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function checkIngredientsAvailability(ingredients, quantity) {
  for (const ingredient of ingredients) {
    const requiredQuantity = ingredient.quantity * quantity;
    if (ingredient.quantity < requiredQuantity) {
      return ingredient;
    }
  }
  return null; // Sufficient quantity of all ingredients
}

async function updateIngredientQuantities(ingredients, quantity) {
  for (const ingredient of ingredients) {
    const requiredQuantity = ingredient.quantity * quantity;
    ingredient.quantity -= requiredQuantity;
    await ingredient.save();
  }
}

exports.addPizzaToInventory = addPizzaToInventory;

// Function to get current inventory status
exports.getInventoryStatus = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("pizza");
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
