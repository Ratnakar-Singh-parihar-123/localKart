import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    console.log(" REGISTER API HIT");
    console.log(" Incoming Body:", req.body);

    const { name, email, password, role } = req.body;

    const userExist = await User.findOne({ email });
    console.log(" Checking if user exists:", userExist);

    if (userExist) {
      console.log(" User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Register User Created:", user);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(" REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    console.log(" LOGIN API HIT");
    console.log(" Incoming Body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(" Found User:", user);

    if (!user) {
      console.log(" Invalid Email");
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(" Password Match:", isMatch);

    if (!isMatch) {
      console.log(" Invalid Password");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("Register Token Generated:", token);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(" LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  console.log(" LOGOUT API HIT");
  res.json({
    message: "Logged out successfully",
  });
};
