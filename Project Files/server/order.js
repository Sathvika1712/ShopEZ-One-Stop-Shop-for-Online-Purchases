const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

/* --------- PLACE ORDER --------- */
router.post("/place", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    const { items, totalAmount } = req.body;

    const newOrder = new Order({
      userId: decoded.id,
      items,
      totalAmount
    });

    await newOrder.save();

    res.json({ message: "Order placed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;