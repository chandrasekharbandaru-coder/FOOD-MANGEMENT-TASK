const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cart.controllers");

// Task 16
router.post("/add", authMiddleware, addToCart);

// Task 17
router.get("/", authMiddleware, getCart);

// Task 18
router.put("/update", authMiddleware, updateCartItem);

// Task 19
router.delete("/remove", authMiddleware, removeItemFromCart);

// Task 20
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
