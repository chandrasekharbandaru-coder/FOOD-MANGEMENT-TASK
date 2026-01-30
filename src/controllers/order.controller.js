const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const mongoose = require("mongoose");

/* =================================
   Task 22: Place Order
   POST /api/orders/place
================================= */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ message: "deliveryAddress is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount,
      deliveryAddress,
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================
   Task 23: Get Logged-in User Orders
   GET /api/orders/my-orders
================================= */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================
   Task 24: Get Single Order
   GET /api/orders?orderId=xxxx
================================= */
exports.getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Valid orderId is required" });
    }

    const order = await Order.findById(orderId)
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================
   Task 25: Update Order Status (Admin)
   PUT /api/orders/status
================================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.query;
    const { status } = req.body;

    const validStatus = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Delivered",
      "Cancelled",
    ];

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================
   Task 26: Verify Payment (Placeholder)
   POST /api/orders/verify-payment
================================= */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Placeholder (Cashfree later)
    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";

    await order.save();

    res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
