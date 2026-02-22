import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart({ cart, increaseQty, decreaseQty, removeItem, setCart, setOrderPlaced }) {

  const navigate = useNavigate();

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const deliveryFee = cart.length > 0 ? 100 : 0;
  const grandTotal = getSubtotal() + deliveryFee;

  /* 🔥 NEW PLACE ORDER FUNCTION */
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const items = cart.map(item => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const res = await fetch("http://localhost:5000/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          items,
          totalAmount: grandTotal
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCart([]);
        setOrderPlaced(true);
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div style={{
      display: "flex",
      gap: "30px",
      padding: "40px",
      background: "#f1f3f6",
      minHeight: "100vh"
    }}>

      {/* LEFT SIDE - CART ITEMS */}
      <div style={{ flex: 3 }}>
        <h2>Your Cart 🛒</h2>

        {cart.length === 0 ? (
          <h3>Cart is Empty</h3>
        ) : (
          cart.map((item) => (
            <div
              key={item._id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
              }}
            >
              <img
                src={item.mainImg}
                alt=""
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  marginBottom: "10px"
                }}
              />

              <h3>{item.title}</h3>
              <p>₹{item.price}</p>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => decreaseQty(item._id)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  -
                </button>

                <span style={{ fontWeight: "bold" }}>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item._id)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  +
                </button>
              </div>

              <p>Total: ₹{item.price * item.quantity}</p>

              <button
                onClick={() => removeItem(item._id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px"
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE - SUMMARY */}
      {cart.length > 0 && (
        <div style={{
          flex: 1,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          height: "fit-content",
          position: "sticky",
          top: "20px"
        }}>
          <h3>Order Summary</h3>

          <p>Subtotal: ₹{getSubtotal()}</p>
          <p>Delivery: ₹{deliveryFee}</p>

          <hr />

          <h2>Total: ₹{grandTotal}</h2>

          <button
            onClick={handlePlaceOrder}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Place Order
          </button>
        </div>
      )}

    </div>
  );
}

export default Cart;