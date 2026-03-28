import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure correct path

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to get _id and role
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Full user object now available
    console.log("Logged-in user ID:", req.user._id); // Debug log
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Only
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
};
