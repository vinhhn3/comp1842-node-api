const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
