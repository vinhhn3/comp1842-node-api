**Requirement: Order Creation and Management**

**Objective**
Allow users to create an Order, where each Order can contain multiple Products with specific quantities.

**Steps:**

1. **Create Order Schema**

   - Define an Order schema that includes fields for order details (e.g., user, order date) and an array of products.

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema (embedded within Order)
const ProductSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Assumes referencing another collection of Products
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// Order Schema
const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Refers to the User collection
    required: true,
    ref: "User",
  },
  products: [ProductSchema], // Array of products, each with quantity and price

  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
```

2. **Create `OrderController` with CRUD Functions**

   - Implement the following operations:
     - **Admin Operations**:
       - **Get all Orders**: Admin can retrieve all orders in the system.
     - **User Operations**:
       - **Create an Order**: Users can create new orders with multiple products and quantities.
       - **Edit an Order**: Users can update their existing orders (e.g., modify product quantities, add or remove products).
       - **Delete an Order**: Users can delete their orders.
       - **Get all Orders by User ID or Username**: Users can retrieve their own orders, which are identified by the User ID or Username extracted via request middleware.

3. **Create Routes with Swagger Annotations**

   - Set up API routes for CRUD operations.
   - Use Swagger annotations to generate API documentation, including descriptions of request/response bodies and parameters.

---
