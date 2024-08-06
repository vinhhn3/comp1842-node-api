## Add Rate Limiter

To add rate limiting to your Node.js API, you can use the `express-rate-limit` package. This helps prevent abuse by limiting the number of requests a client can make within a specified timeframe. Here’s how to set it up:Step 1: Install the `express-rate-limit` PackageFirst, install the `express-rate-limit` package using npm:

```bash
npm install express-rate-limit
```

### Step 2: Configure Rate Limiting Middleware

Update your main application file to configure and use the rate limiting middleware.
**app.js**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Import rate limit
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./db");

const app = express();

connectDB(); // Connect to MongoDB

// Enable CORS for all origins
app.use(cors());

// Limit each IP to 100 requests per windowMs (e.g., per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

module.exports = app;
```

### Step 3: Start the Server

Start the server:

```bash
node server.js
```

### Summary

By using the `express-rate-limit` package, you have added rate limiting to your Node.js API. This configuration limits each IP to 100 requests per 15 minutes, helping to prevent abuse and ensure fair usage of your API.
