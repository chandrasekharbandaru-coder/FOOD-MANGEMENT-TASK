const express = require("express");
const router = express.Router();

const {
  createPaymentOrder,
  verifyPaymentStatus
} = require("../controllers/payment.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ================================
// CREATE CASHFREE ORDER
// ================================
router.post(
  "/create-order",
  authMiddleware,
  createPaymentOrder
);

// ================================
// VERIFY PAYMENT (NO WEBHOOK)
// ================================
router.post(
  "/verify",
  authMiddleware,
  verifyPaymentStatus
);

module.exports = router;
