const axios = require("axios");
const Order = require("../models/order.model");

// ================================
// CREATE CASHFREE ORDER
// POST /api/payments/create-order
// ================================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    // 1️⃣ Validate input
    if (!orderId || !userId) {
      return res.status(400).json({
        message: "orderId and userId are required"
      });
    }

    // 2️⃣ Fetch order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 3️⃣ Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: Order does not belong to this user"
      });
    }

    // 4️⃣ Prepare Cashfree payload
    const payload = {
      order_id: order._id.toString(),
      order_amount: order.totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_phone: "9999999999",
        customer_email: "test@gmail.com"
      }
    };

    // 5️⃣ Create Cashfree order
    const response = await axios.post(
      `${process.env.CASHFREE_API_URL}/orders`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      }
    );

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      cashfree: response.data
    });

  } catch (error) {
    console.error("Cashfree Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Payment order creation failed",
      error: error.response?.data || error.message
    });
  }
};
