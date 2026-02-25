const Cart = require("../models/cart.model");
const Food = require("../models/food.model");
const mongoose = require("mongoose");

/* ================================
   Task 16: Add Item to Cart
================================ */
exports.addToCart = async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;
    const tokenUserId = req.user.id;

    if (!userId || !foodId || quantity === undefined) {
      return res.status(400).json({
        message: "userId, foodId, quantity required",
      });
    }

    //JWT check
    if (userId !== tokenUserId) {
      return res.status(403).json({ message: "User ID mismatch" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    /*FIXED FOOD LOOKUP */
    let food;

    // Try Mongo _id
    if (mongoose.Types.ObjectId.isValid(foodId)) {
      food = await Food.findById(foodId);
    }

    // Try custom foodId
    if (!food) {
      food = await Food.findOne({ foodId });
    }

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    let cart = await Cart.findOne({ userId: tokenUserId });

    if (!cart) {
      cart = new Cart({
        userId: tokenUserId,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.foodId.toString() === food._id.toString() ||
        item.foodId === food.foodId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        foodId: food._id,
        name: food.name,
        image: food.image,
        price: food.price,
        quantity: Number(quantity),
      });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Task 17: Get User Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Task 18: Update Cart Item
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "foodId and quantity required" });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (Number(quantity) === 0) {
      cart.items.splice(itemIndex, 1); // remove item
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Task 19: Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.query;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId
    );

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item removed successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Task 20: Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
