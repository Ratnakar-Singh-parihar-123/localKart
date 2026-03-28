import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

//  DB connect with error handling
connectDB();

const app = express();

//  Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://local-kart-gamma.vercel.app",
];

//  SAFE CORS (NO CRASH )
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        return callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

//  Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

//  Health check
app.get("/", (req, res) => {
  res.send(" API Running...");
});

//  404 handler (IMPORTANT)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

//  Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
