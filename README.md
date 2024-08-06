## 2: Add MongoDB

### Step 1: Install Mongoose

First, install Mongoose using npm:

```bash
npm install mongoose
```

### Step 2: Set Up Mongoose Connection

Create a new file to handle the MongoDB connection.
**db.js**

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/nodejs-api", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Step 3: Update Models to Use Mongoose

Update the `Product` and `Category` models to use Mongoose schemas.**models/product.js**

```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
```

**models/category.js**

```javascript
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
```

### Step 4: Update Controllers to Use Mongoose Methods

Modify the controllers to use Mongoose methods for database operations.
**controllers/productController.js**

```javascript
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
```

**controllers/categoryController.js**

```javascript
const Category = require("../models/category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (category) {
      res.json(category);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      res.status(204).send();
    } else {
      res.status(404).send("Category not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
```

### Step 5: Update the Main Application File

Update the main application file to connect to the MongoDB database.
**app.js**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const connectDB = require("./db");

const app = express();

connectDB(); // Connect to MongoDB

app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
```

### Step 6: Run the Application

Start the server:

```bash
node server.js
```

### Summary

You have now integrated MongoDB into your Node.js API using Mongoose. The data for products and categories is now stored in a MongoDB database, and the controllers have been updated to perform database operations using Mongoose methods.
