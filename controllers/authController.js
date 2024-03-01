const bcrypt = require("bcrypt");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const LocalStrategy = require("passport-local").Strategy; // Change to LocalStrategy
const User = require("../models/User");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "arulmozhikumar7@gmail.com",
    pass: "tvkImS8MV4WX9qdH",
  },
});

// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
  try {
    // Define email content
    const mailOptions = {
      from: "arulmozhikumar7@gmail.com",
      to: email,
      subject: "Verify your email",
      text: `Please click the following link to verify your email: http://localhost:3000/api/auth/verify/${verificationToken}`,
    };
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Failed to send verification email");
  }
}
function generateVerificationToken() {
  return crypto.randomBytes(20).toString("hex");
}

// Configure Passport with the Local strategy for authentication
passport.use(
  new LocalStrategy(async (name, password, done) => {
    try {
      const user = await User.findOne({ name }); // Assuming username field is used for authentication
      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: "Invalid password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create Verification Token
    const verificationToken = generateVerificationToken();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });
    await newUser.save();
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      message: "User created successfully. Please verify your email",
    });
  } catch (err) {
    next(err); // Pass any error to the error handling middleware
  }
};

exports.signin = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          throw err;
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        // If authentication succeeds, generate and return a bearer token
        const token = generateBearerToken(); // Implement your token generation logic
        user.token = token;
        await user.save();
        return res.status(200).json({ token });
      } catch (err) {
        next(err); // Pass any error to the error handling middleware
      }
    }
  )(req, res, next);
};

// Function to generate bearer token
function generateBearerToken() {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
}

exports.logout = async (req, res, next) => {
  try {
    const user = req.user; // Assuming user is authenticated
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    user.token = null; // Invalidate the token
    await user.save();
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err); // Pass any error to the error handling middleware
  }
};
