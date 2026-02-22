const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/authMiddleware");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/* -------- ADMIN DASHBOARD DATA -------- */
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalProducts,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/* -------- GET ALL PRODUCTS (ADMIN) -------- */
router.get("/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/* -------- GET ALL ORDERS (ADMIN) -------- */
/* -------- GET ALL ORDERS (ADMIN) -------- */
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


/* -------- ADD PRODUCT (ADMIN) -------- */
router.post("/", adminAuth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;