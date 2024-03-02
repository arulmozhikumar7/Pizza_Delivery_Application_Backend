const Ingredient = require("../models/Ingredient");

exports.addIngredient = async (req, res) => {
  try {
    const { name, category, quantity, threshold } = req.body;
    const newIngredient = new Ingredient({
      name,
      category,
      quantity,
      threshold,
    });
    await newIngredient.save();
    res.status(200).json({ message: "Ingredient added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
