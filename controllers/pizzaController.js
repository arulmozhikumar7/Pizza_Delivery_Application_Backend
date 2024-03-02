const Pizza = require("../models/Pizza");

exports.addpizza = async (req, res) => {
  try {
    const { name, price, ingredients, image, description } = req.body;
    const newPizza = new Pizza({
      name,
      price,
      ingredients,
      image,
      description,
    });
    await newPizza.save();
    res.status(200).json({ message: "Pizza added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
