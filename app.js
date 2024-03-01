const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
//Models
const Pizza = require("./models/Pizza");
const Inventory = require("./models/Inventory");
const User = require("./models/User");
const cors = require("cors");
const db = mongoose.connect("mongodb://localhost:27017/PIZZA_APPLICATION");
db.then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
