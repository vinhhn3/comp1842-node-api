const Product = require("../models/product");

let products = [];

exports.getAllProducts = (req, res) => {
  res.json(products);
};

exports.getProductById = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
};

exports.createProduct = (req, res) => {
  const { id, name, category } = req.body;
  const product = new Product(id, name, category);
  products.push(product);
  res.status(201).json(product);
};

exports.updateProduct = (req, res) => {
  const { id, name, category } = req.body;
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (product) {
    product.name = name;
    product.category = category;
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
};

exports.deleteProduct = (req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found");
  }
};
