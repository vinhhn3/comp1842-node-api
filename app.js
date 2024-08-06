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
