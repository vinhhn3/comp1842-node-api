## Add Authorization: Admin and Customer role

### Step 1: Update User Model

Add a `role` field to the `User` model.**models/user.js**

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare input password with the hashed password in the database
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### Step 2: Update Authentication Controller

Ensure that the `registerUser` function allows setting the user role.**controllers/authController.js**

```javascript
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ username, password, role });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, "secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, "secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
```

### Step 3: Create Authorization Middleware

Create a middleware to check user roles.
**middleware/auth.js**

```javascript
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

**middleware/role.js**

```javascript
module.exports = function (roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};
```

### Step 4: Protect Routes with Role-Based Access Control

Update the routes to include role checks.
**routes/productRoutes.js**

```javascript
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
```

**routes/categoryRoutes.js**

```javascript
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", auth, categoryController.getAllCategories);
router.get("/:id", auth, categoryController.getCategoryById);
router.post("/", auth, role(["admin"]), categoryController.createCategory);
router.put("/:id", auth, role(["admin"]), categoryController.updateCategory);
router.delete("/:id", auth, role(["admin"]), categoryController.deleteCategory);

module.exports = router;
```

### Step 5: Update Authentication Routes

Update the authentication routes to allow setting roles.
**routes/authRoutes.js**

```javascript
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").isLength({ min: 6 }),
    check("role", "Role is required").isIn(["admin", "customer"]),
  ],
  authController.registerUser
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  authController.loginUser
);

router.get("/", auth, authController.getUser);

module.exports = router;
```

### Step 6: Run the Application

Start the server:

```bash
node server.js
```

### Summary

You have now implemented role-based authorization in your Node.js API. Admin users can create, update, and delete products and categories, while customer users can only read them. This ensures that sensitive operations are restricted to users with the appropriate permissions.
