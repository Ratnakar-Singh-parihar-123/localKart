import Product from "../models/Product.js";

// ================= CREATE PRODUCT =================
// ================= CREATE PRODUCT =================
export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { title, price, description, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    // Cloudinary image URL
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path; // directly store Cloudinary URL
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl; // optional
    }

    const product = await Product.create({
      title,
      price,
      description: description || "",
      category: category || "",
      image: imageUrl,
      createdBy: req.user.id, // <-- FIXED here
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= GET ALL PRODUCTS =================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name email");
    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= GET SINGLE PRODUCT =================
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Authorization
    if (req.user.role !== "admin" && !product.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ FIXED IMAGE LOGIC
    let imageUrl = product.image;

    if (req.file) {
      imageUrl = req.file.path; // 🔥 CLOUDINARY URL
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Update fields
    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.image = imageUrl;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: Only admin or owner can delete
    if (req.user.role !== "admin" && !product.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
