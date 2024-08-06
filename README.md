## 1: Basic NodeJS API

### Step 1: Set Up the Project

1. **Initialize the Project**
   First, create a new directory for your project and navigate into it. Then, initialize a new Node.js project using npm:

```bash
mkdir nodejs-api
cd nodejs-api
npm init -y
```

2. **Install Dependencies**
   Next, install the necessary dependencies:

```bash
npm install express body-parser
```

### Step 2: Create the Directory Structure

Create the following directory structure to organize your project:

```Copy code
nodejs-api/
├── controllers/
│   ├── categoryController.js
│   └── productController.js
├── models/
│   ├── category.js
│   └── product.js
├── routes/
│   ├── categoryRoutes.js
│   └── productRoutes.js
├── app.js
└── server.js
```

### Step 3: Create the Models

Define the data models for Product and Category. Since we are not using a database, we will use in-memory data storage.
**models/product.js**

```javascript
class Product {
  constructor(id, name, category) {
    this.id = id;
    this.name = name;
    this.category = category;
  }
}

module.exports = Product;
```

**models/category.js**

```javascript
class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

module.exports = Category;
```

### Step 4: Create the Controllers

Implement the logic for handling requests related to products and categories.
**controllers/productController.js**

```javascript
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
```

**controllers/categoryController.js**

```javascript
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
```

### Step 5: Create the Routes

Define the routes for products and categories.
**routes/productRoutes.js**

```javascript
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
```

**routes/categoryRoutes.js**

```javascript
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
```

### Step 6: Set Up the Express Application

Create the main application file.
**app.js**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
```

### Step 7: Create the Server

Create the server file to start the application.
**server.js**

```javascript
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Step 8: Run the Application

Start the server by running:

```bash
node server.js
```

This concludes the creation of a basic Node.js API following the MVC pattern without a database.
