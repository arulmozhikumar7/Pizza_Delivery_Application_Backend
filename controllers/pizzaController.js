const Pizza = require("../models/Pizza");

exports.addpizza = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const newPizza = new Pizza({
      name,
      price,
      image,
      description,
    });
    await newPizza.save();
    res.status(200).json({ message: "Pizza added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getallPizza = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editPizza = async (req, res) => {
  try {
    const { id } = req.params; // Extract the pizza ID from the request parameters
    const { name, price, image, description } = req.body; // Extract the updated pizza details from the request body

    // Find the pizza by ID and update its details
    const updatedPizza = await Pizza.findByIdAndUpdate(
      id,
      { name, price, image, description },
      { new: true }
    );

    // If the pizza is not found, return a 404 status code
    if (!updatedPizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    // Return a success message along with the updated pizza
    res
      .status(200)
      .json({ message: "Pizza updated successfully", pizza: updatedPizza });
  } catch (err) {
    // Handle any errors and return a 500 status code with an error message
    res.status(500).json({ message: err.message });
  }
};
