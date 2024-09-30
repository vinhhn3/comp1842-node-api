const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/all", auth, orderController.getAllOrders);
router.post("/create", auth, role(["customer"]), orderController.createOrder);

module.exports = router;
