import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>

      {/* 🔷 NAVBAR */}
      <nav style={{
        background: "linear-gradient(90deg,#4f46e5,#6366f1)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}>
        <h2 style={{ margin: 0 }}>ShopEZ</h2>

        <div style={{ display: "flex", gap: "15px" }}>
          <input
            placeholder="Search Electronics, Fashion, mobiles, etc."
            style={{
              padding: "8px 15px",
              borderRadius: "20px",
              border: "none",
              width: "300px"
            }}
          />
          <button style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
            background: "#fff",
            color: "#4f46e5",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            Login
          </button>
        </div>
      </nav>

      {/* 🔷 MAIN CONTENT */}
      <div style={{
        display: "flex",
        padding: "20px 40px"
      }}>

        {/* 🔥 FILTER SIDEBAR */}
        <div style={{
          width: "250px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          height: "fit-content"
        }}>
          <h3>Filters</h3>

          <hr />

          <h4>Sort By</h4>
          <div>
            <label><input type="radio" name="sort" /> Popular</label><br />
            <label><input type="radio" name="sort" /> Price (low to high)</label><br />
            <label><input type="radio" name="sort" /> Price (high to low)</label><br />
            <label><input type="radio" name="sort" /> Discount</label>
          </div>

          <hr />

          <h4>Categories</h4>
          <div>
            <label><input type="checkbox" /> Mobiles</label><br />
            <label><input type="checkbox" /> Electronics</label><br />
            <label><input type="checkbox" /> Fashion</label><br />
            <label><input type="checkbox" /> Groceries</label><br />
            <label><input type="checkbox" /> Sports</label>
          </div>
        </div>

        {/* 🔥 PRODUCTS GRID */}
        <div style={{
          flex: 1,
          marginLeft: "30px"
        }}>
          <h2>All Products</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "25px",
            marginTop: "20px"
          }}>
            {products.map(product => {
              const discountedPrice =
                product.price - (product.price * product.discount / 100);

              return (
                <div key={product._id} style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                }}>
                  <img
                    src={product.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      borderRadius: "10px"
                    }}
                  />

                  <h4 style={{ marginTop: "10px" }}>
                    {product.title}
                  </h4>

                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    {product.description}
                  </p>

                  <div style={{ marginTop: "8px" }}>
                    <span style={{ fontWeight: "bold" }}>
                      ₹{discountedPrice}
                    </span>
                    <span style={{
                      marginLeft: "8px",
                      textDecoration: "line-through",
                      color: "gray"
                    }}>
                      ₹{product.price}
                    </span>
                    <span style={{
                      marginLeft: "8px",
                      color: "green",
                      fontWeight: "bold"
                    }}>
                      {product.discount}% off
                    </span>
                  </div>

                  <button style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}>
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;