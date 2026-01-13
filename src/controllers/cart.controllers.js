const Cart = require("../models/cart.model");
const Food = require("../models/food.model");
const mongoose = require("mongoose");

/* ================================
   Task 16: Add Item to Cart
================================ */
exports.addToCart = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    if (!userId || !foodId || !quantity) {
      return res.status(400).json({ message: "userId, foodId, quantity required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const food = await Food.findOne({ foodId });
    if (!food) return res.status(404).json({ message: "Food not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    let cart = await Cart.findOne({ userId: userObjectId });

    if (!cart) {
      cart = new Cart({ userId: userObjectId, items: [], totalAmount: 0 });
    }

    const item = cart.items.find(i => i.foodId === foodId);

    if (item) {
      item.quantity += Number(quantity);
    } else {
      cart.items.push({
        foodId,
        name: food.name,
        image: food.image,
        price: food.price,
        quantity: Number(quantity)
      });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   Task 17: Get User Cart
================================ */
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!cart) return res.json({ items: [], totalAmount: 0 });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   Task 18: Update Cart Item
================================ */
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    if (!userId || !foodId || quantity === undefined) {
      return res.status(400).json({ message: "userId, foodId, quantity required" });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.foodId === foodId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = Number(quantity);

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Cart updated", cart });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   Task 19: Remove Item from Cart
================================ */
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId, foodId } = req.query;

    if (!userId || !foodId) {
      return res.status(400).json({ message: "userId & foodId required" });
    }

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.foodId !== foodId);

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================
   Task 20: Clear Cart
================================ */
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.query;

    const cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: "Cart cleared successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
