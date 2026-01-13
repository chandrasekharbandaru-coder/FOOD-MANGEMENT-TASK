const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cart.controllers");

// Task 16
router.post("/add", addToCart);

// Task 17
router.get("/", getCart);

// Task 18
router.put("/update", updateCartItem);

// Task 19
router.delete("/remove", removeItemFromCart);

// Task 20
router.delete("/clear", clearCart);

module.exports = router;
