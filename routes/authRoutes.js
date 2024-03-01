const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/logout", authController.logout);
router.put("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired verification token" });
    }
    // Update user's isVerified status
    user.isVerified = true;
    user.verificationToken = null; // Clear verification token
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
