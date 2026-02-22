const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    const user = await User.findById(decoded.id);

    if (!user || user.usertype !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminAuth;