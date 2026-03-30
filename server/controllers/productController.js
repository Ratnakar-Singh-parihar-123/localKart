import Product from "../models/Product.js";

// CREATE PRODUCT (Admin Only)
export const createProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    const { title, price, description, category } = req.body;

    if (!title || !price)
      return res.status(400).json({ message: "Title and Price are required" });

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || "";

    const product = await Product.create({
      title,
      price,
      description: description || "",
      category: category || "General",
      image: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products =
      req.user?.role === "admin"
        ? await Product.find({ createdBy: req.user._id }).populate(
            "createdBy",
            "name email",
          )
        : await Product.find().populate("createdBy", "name email");

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE PRODUCT (Owner Admin Only)
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || product.image;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE PRODUCT (Owner Admin Only)
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
