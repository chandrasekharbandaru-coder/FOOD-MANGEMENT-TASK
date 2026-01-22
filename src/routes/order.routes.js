const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Task 22
router.post("/place", authMiddleware, placeOrder);

// Task 23 (ALL USERS ORDERS)
router.get("/my-orders", authMiddleware, getMyOrders);

// Task 24
router.get("/", authMiddleware, getSingleOrder);

// Task 25
router.put("/status", authMiddleware, updateOrderStatus);

module.exports = router;
