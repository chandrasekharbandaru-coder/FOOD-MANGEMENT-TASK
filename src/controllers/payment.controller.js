const axios = require("axios");
const Order = require("../models/order.model");

// ================================
// CREATE CASHFREE ORDER
// POST /api/payments/create-order
// ================================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    //Validate input
    if (!orderId || !userId) {
      return res.status(400).json({
        message: "orderId and userId are required"
      });
    }

    //Fetch order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: Order does not belong to this user"
      });
    }

    //Prepare Cashfree payload
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

    //Create Cashfree order
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

    //Send response
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
// ======================================
// VERIFY PAYMENT STATUS (NO WEBHOOK)
// POST /api/payments/verify
// ======================================
exports.verifyPaymentStatus = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    //Validate input
    if (!orderId || !userId) {
      return res.status(400).json({
        message: "orderId and userId are required"
      });
    }

    //Fetch order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    //Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized: Order does not belong to this user"
      });
    }

    //Call Cashfree Payments API
    const response = await axios.get(
      `${process.env.CASHFREE_API_URL}/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      }
    );

    const payments = response.data;

    //Payment not initiated
    if (!payments || payments.length === 0) {
      return res.status(200).json({
        success: false,
        status: "NOT_PAID",
        message: "Payment not initiated yet"
      });
    }

    //Strict SUCCESS check
    const successPayment = payments.find(
      (p) => p.payment_status === "SUCCESS"
    );

    if (!successPayment) {
      return res.status(200).json({
        success: false,
        status: payments[0].payment_status,
        message: "Payment not successful yet"
      });
    }

    //Update order ONLY after success
    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.paymentId = successPayment.cf_payment_id;

    await order.save();

    //Response
    res.status(200).json({
      success: true,
      status: "PAID",
      message: "Payment verified successfully",
      payment: successPayment,
      order
    });

  } catch (error) {
    console.error("Verify Payment Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Payment verification failed",
      error: error.response?.data || error.message
    });
  }
};
