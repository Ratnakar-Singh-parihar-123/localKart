import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Load env variables
dotenv.config();

// Connect DB
connectDB();

const app = express();

//  Allowed origins
const allowedOrigins = [
  "http://localhost:5173",               
  "https://local-kart-gamma.vercel.app", 
  "https://local-kart-zeta.vercel.app",  
];
//  CORS (FIXED - only once)
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//  Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Serve uploads folder statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//  API Routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/products",
  (req, res, next) => {
    console.log("PRODUCT ROUTE HIT");
    next();
  },
  productRoutes,
);

app.get("/test-products", (req, res) => {
  res.json({ message: "Products route working" });
});
app.get("/", (req, res) => {
  res.send(" API Running...");
});

//  404 handler (important)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});

//  PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
});
