const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
const routes = require("./routes");

const db = mongoose.connect(
  "mongodb+srv://arul27032004:27032004arul@cluster0.skmaqx2.mongodb.net/pizzaapplication"
);
db.then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
