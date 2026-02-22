const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const app = express();
const adminRoutes = require("./routes/admin");
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
// CONNECT TO MONGODB ATLAS
mongoose.connect("mongodb+srv://lakshmisathvikadevanaboina_db_user:GeKaXUdSNizq47qi@cluster0.k1l1vxy.mongodb.net/shopez?retryWrites=true&w=majority")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });

// Test route
app.get("/", (req, res) => {
  res.send("ShopEZ API Running");
});

// REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LISTEN SHOULD ALWAYS BE LAST
// ADD PRODUCT
app.post("/add-product", async (req, res) => {
  try {
    const { title, description, price, category, mainImg, discount } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      mainImg,
      discount
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET ALL PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const category = req.query.category;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ADD TO CART
app.post("/add-to-cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cartItem = new Cart({
      userId,
      productId,
      quantity
    });

    await cartItem.save();

    res.status(201).json({ message: "Product added to cart" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET USER CART
app.get("/cart/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId })
      .populate("productId");

    res.status(200).json(cartItems);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PLACE ORDER
app.post("/place-order", async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    // Get cart items
    const cartItems = await Cart.find({ userId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    const products = cartItems.map(item => {
      totalAmount += item.productId.price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity
      };
    });

    // Create order
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      address,
      paymentMethod
    });

    await newOrder.save();

    // Clear cart after order
    await Cart.deleteMany({ userId });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET USER ORDERS
app.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
