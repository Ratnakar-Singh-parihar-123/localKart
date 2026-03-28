// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 🔥 CORS (allow frontend)
app.use(cors());

// 🔥 IMPORTANT (FormData + JSON support)
app.use(express.urlencoded({ extended: true })); // form-data support
app.use(express.json()); // JSON support

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 🏠 Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ❌ Global Error Handler (best practice)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});

// 🚀 Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
