import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import ProductPage from "./ProductPage";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminNewProduct from "./AdminNewProduct";
/* ---------------- MAIN APP ROUTER ---------------- */

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/new-product" element={<AdminNewProduct />} />

        <Route
          path="/"
          element={<HomePage cart={cart} addToCart={addToCart} />}
        />

        <Route
          path="/product/:id"
          element={<ProductPage cart={cart} addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeItem={removeItem}
              setCart={setCart}
              setOrderPlaced={setOrderPlaced}
            />
          }
        />
      </Routes>

      {orderPlaced && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <h2>🎉 Order Placed Successfully!</h2>
            <button
              onClick={() => setOrderPlaced(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- HOME PAGE ---------------- */

function HomePage({ cart, addToCart }) {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  const handleCheckboxChange = (category) => {
    setSelectedFilters(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products.filter(product =>
    selectedFilters.length === 0 ||
    selectedFilters.includes(product.category)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low") return a.price - b.price;
    if (sortOption === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        background: "linear-gradient(90deg,#4f46e5,#6366f1)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
        <h2>ShopEZ</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          {currentUser ? (
            <>
              <span>Hi, {currentUser.username}</span>
              <button onClick={handleLogout}
                style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px" }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button style={{ padding: "8px 15px" }}>Login</button>
            </Link>
          )}

          <Link to="/cart">
            <button>Cart 🛒 ({cart.length})</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        margin: "30px 40px",
        borderRadius: "25px",
        padding: "60px",
        background: "linear-gradient(-45deg, #ff8a00, #e52e71, #6366f1, #4f46e5)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 8s ease infinite",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h1>🔥 Super Sale is Live!</h1>
          <p>Up to 50% OFF on Fashion, Electronics & More</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: "25px",
        padding: "40px"
      }}>
        {sortedProducts.map(product => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "20px",
              cursor: "pointer"
            }}
          >
            <img
              src={product.mainImg}
              alt=""
              style={{ width: "100%", height: "160px", objectFit: "contain" }}
            />
            <h3>{product.title}</h3>
            <p>₹{product.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;