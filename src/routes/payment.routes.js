const express = require("express");
const router = express.Router();

const {
  createPaymentOrder,
  checkPaymentStatus
} = require("../controllers/payment.controller");

router.post("/create-order", createPaymentOrder);

module.exports = router;
