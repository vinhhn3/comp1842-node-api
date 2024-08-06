## Setup CORS

To enable Cross-Origin Resource Sharing (CORS) in your Node.js API, you can use the `cors` middleware package. This allows your API to handle requests from different origins. Here's how to set it up:

### Step 1: Install the CORS Package

First, install the CORS package using npm:

```bash
npm install cors
```

### Step 2: Use CORS Middleware in Your Application

Update your main application file to use the CORS middleware.
**app.js**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./db");

const app = express();

connectDB(); // Connect to MongoDB

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

module.exports = app;
```

### Step 3: Configure CORS Options (Optional)

You can configure the CORS middleware to specify which origins are allowed and other settings.
**app.js**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./db");

const app = express();

connectDB(); // Connect to MongoDB

const corsOptions = {
  origin: "http://example.com", // Allow specific origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
};

app.use(cors(corsOptions)); // Enable CORS with options
app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

module.exports = app;
```

### Step 4: Start the Server

Start the server:

```bash
node server.js
```

### Summary

You have now enabled CORS in your Node.js API, allowing it to handle requests from different origins. By using the `cors` middleware, you can control which origins, methods, and headers are allowed to interact with your API.
