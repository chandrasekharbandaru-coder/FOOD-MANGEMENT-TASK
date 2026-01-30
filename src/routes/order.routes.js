const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  verifyPayment
} = require("../controllers/order.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Task 22: Place order
router.post("/place", authMiddleware, placeOrder);

// Task 23: Get logged-in user's orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Task 24: Get single order
router.get("/", authMiddleware, getSingleOrder);

// Task 25: Update order status (admin)
router.put("/status", authMiddleware, updateOrderStatus);

// Task 26: Verify payment
router.post("/verify-payment", authMiddleware, verifyPayment);

module.exports = router;
