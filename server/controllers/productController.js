import Product from "../models/Product.js";

//
// CREATE PRODUCT (Admin Only)
//
export const createProduct = async (req, res) => {
  try {
    console.log("CREATE PRODUCT - user:", req.user);

    if (!req.user || req.user.role !== "admin") {
      console.log("CREATE ERROR: Admin access denied");
      return res.status(403).json({ message: "Admin access only" });
    }

    const { title, price, description, category } = req.body;
    if (!title || !price) {
      console.log("CREATE ERROR: Missing title or price");
      return res.status(400).json({ message: "Title and Price are required" });
    }

    const imageUrl = req.file ? req.file.path : req.body.imageUrl || "";

    const product = await Product.create({
      title,
      price,
      description: description || "",
      category: category || "General",
      image: imageUrl,
      createdBy: req.user._id,
    });

    console.log("PRODUCT CREATED:", product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

//
// GET ALL PRODUCTS
//
export const getProducts = async (req, res) => {
  try {
    console.log("GET PRODUCTS - user:", req.user);

    let products;
    if (req.user && req.user.role === "admin") {
      // Admin sees only own products
      products = await Product.find({ createdBy: req.user._id }).populate(
        "createdBy",
        "name email",
      );
    } else {
      // Public / non-admin
      products = await Product.find().populate("createdBy", "name email");
    }

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// GET SINGLE PRODUCT
//
export const getProduct = async (req, res) => {
  try {
    console.log("GET PRODUCT - ID:", req.params.id);

    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!product) {
      console.log("GET PRODUCT ERROR: Not found");
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// UPDATE PRODUCT (Owner Admin Only)
//
export const updateProduct = async (req, res) => {
  try {
    console.log(
      "UPDATE PRODUCT - user:",
      req.user,
      "product ID:",
      req.params.id,
    );

    if (!req.user || req.user.role !== "admin") {
      console.log("UPDATE ERROR: Admin access denied");
      return res.status(403).json({ message: "Admin access only" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("UPDATE ERROR: Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // DEBUG: Show IDs
    console.log("Product owner ID:", product.createdBy);
    console.log("Logged-in user ID:", req.user._id);

    // Convert ObjectId to string safely
    const productOwnerId =
      product.createdBy?._id?.toString() || product.createdBy?.toString();
    const loggedInUserId = req.user._id?.toString();

    if (
      !productOwnerId ||
      !loggedInUserId ||
      productOwnerId !== loggedInUserId
    ) {
      console.log("UPDATE ERROR: Not authorized to update this product");
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    // Update fields
    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.image = req.file
      ? req.file.path
      : req.body.imageUrl || product.image;

    const updated = await product.save();
    console.log("PRODUCT UPDATED:", updated._id);
    res.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// DELETE PRODUCT (Owner Admin Only)
//
export const deleteProduct = async (req, res) => {
  try {
    console.log(
      "DELETE PRODUCT - user:",
      req.user,
      "product ID:",
      req.params.id,
    );

    if (!req.user || req.user.role !== "admin") {
      console.log("DELETE ERROR: Admin access denied");
      return res.status(403).json({ message: "Admin access only" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("DELETE ERROR: Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product owner ID:", product.createdBy);
    console.log("Logged-in user ID:", req.user._id);

    const productOwnerId =
      product.createdBy?._id?.toString() || product.createdBy?.toString();
    const loggedInUserId = req.user._id?.toString();

    if (
      !productOwnerId ||
      !loggedInUserId ||
      productOwnerId !== loggedInUserId
    ) {
      console.log("DELETE ERROR: Not authorized to delete this product");
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    console.log("PRODUCT DELETED:", product._id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
