const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", auth, productController.getAllProducts);
router.get("/:id", auth, productController.getProductById);
router.post("/", auth, role(["admin"]), productController.createProduct);
router.put("/:id", auth, role(["admin"]), productController.updateProduct);
router.delete("/:id", auth, role(["admin"]), productController.deleteProduct);

module.exports = router;
