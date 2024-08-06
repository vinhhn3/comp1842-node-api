const Category = require("../models/category");

let categories = [];

exports.getAllCategories = (req, res) => {
  res.json(categories);
};

exports.getCategoryById = (req, res) => {
  const category = categories.find((c) => c.id === parseInt(req.params.id));
  if (category) {
    res.json(category);
  } else {
    res.status(404).send("Category not found");
  }
};

exports.createCategory = (req, res) => {
  const { id, name } = req.body;
  const category = new Category(id, name);
  categories.push(category);
  res.status(201).json(category);
};

exports.updateCategory = (req, res) => {
  const { id, name } = req.body;
  const category = categories.find((c) => c.id === parseInt(req.params.id));
  if (category) {
    category.name = name;
    res.json(category);
  } else {
    res.status(404).send("Category not found");
  }
};

exports.deleteCategory = (req, res) => {
  const categoryIndex = categories.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Category not found");
  }
};
