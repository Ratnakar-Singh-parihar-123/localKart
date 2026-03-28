import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

//  Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://local-kart-gamma.vercel.app",
];

//  CORS FIXED 🔥
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

//  Preflight (IMPORTANT)
app.use(cors());

//  Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

//  Test
app.get("/", (req, res) => {
  res.send("API Running...");
});

//  Error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});

//  PORT (Render fix)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
});
