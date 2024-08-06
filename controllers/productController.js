const Product = require("../models/product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;
    const product = new Product({ name, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category },
      { new: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(204).send();
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
