const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const mongoose = require("mongoose");
/* =================================
   Task 22: Place Order (JWT + userId)
   POST /api/orders/place
================================= */
exports.placeOrder = async (req, res) => {
  try {
    const { userId, deliveryAddress } = req.body;

    if (!userId || !deliveryAddress) {
      return res.status(400).json({
        message: "userId and deliveryAddress are required",
      });
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

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      _id: order._id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
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

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

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

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================
   Task 25: Update Order Status
   PUT /api/orders/status
================================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.query;
    const { status } = req.body;

    const validStatus = [
      "Pending",
      "Confirmed",
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
