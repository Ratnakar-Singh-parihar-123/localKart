import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), createProduct);

router.get("/", getProducts);
router.get("/:id", getProduct);

router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
