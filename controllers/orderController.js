const Order = require("../models/order");

exports.getAllOrders = async (req, res) => {
  const user = req.user;

  if (user.role === "admin") {
    try {
      const orders = await Order.find()
        .populate("user")
        .populate("products.product");
      res.json(orders);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }

  try {
    const orders = await Order.find({ user: user.id })
      .populate("user")
      .populate("products.product");
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
};

exports.createOrder = async (req, res) => {
  const user = req.user;
  console.log(user);
  const { products } = req.body;

  console.log(products);

  try {
    const newOrder = new Order({ user: user.id, products: products });
    await newOrder.save();
    return res.status(200).send("Order created");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
};
