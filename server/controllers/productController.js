import Product from "../models/Product.js";

//  CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { title, price, description, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    let imageUrl = "";

    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

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
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

//  GET ALL PRODUCTS (ONLY LOGGED-IN USER)
export const getProducts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const products = await Product.find({
      createdBy: req.user._id,
    }).populate("createdBy", "name email");

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  GET SINGLE PRODUCT (ONLY OWNER)
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  UPDATE PRODUCT (ONLY OWNER)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Not authorized or not found" });
    }

    let imageUrl = product.image;

    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

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

//  DELETE PRODUCT (ONLY OWNER)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Not authorized or product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
