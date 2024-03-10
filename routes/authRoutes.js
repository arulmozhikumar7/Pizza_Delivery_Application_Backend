const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const bcrypt = require("bcrypt");
const User = require("../models/User");
router.get("/", authController.getAllusers);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/logout", authController.logout);
router.get("/verify/:token", async (req, res) => {
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
    return res.status(200).send(`
       <div style="text-align: center; margin-top: 50px;">
    <h1 style="color: #007bff; font-family: Arial, sans-serif;">
      Email Verified Successfully.
    </h1>
    <p style="font-size: 18px; font-family: Arial, sans-serif;">
      Close this tab and go back to your website.
        <a href="https://pizza-delivery-application-frontend.vercel.app" style="color: #007bff; text-decoration: none;">Go back</a>
    </p>
  </div>`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
router.post("/forgotpassword", authController.forgotPassword);
router.post("/reset-password", async (req, res, next) => {
  try {
    const { token } = req.body;
    const { newPassword } = req.body;
    // Find the user by the reset token and check if it's still valid
    const user = await User.findOne({
      resetToken: token,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    console.log(token);
    console.log(req.body);

    await user.save();
    return res.status(200).send({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
