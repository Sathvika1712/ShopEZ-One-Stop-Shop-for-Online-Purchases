import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/admin/dashboard", {
        headers: { Authorization: token }
      });

      const data = await res.json();

      if (res.ok) {
        setStats(data);
      } else {
        alert("Access denied");
        navigate("/");
      }
    };

    fetchDashboard();
  }, [navigate]);

  return (
    <div style={{
      background: "#2b3440",
      minHeight: "100vh",
      color: "white"
    }}>

      {/* TOP NAV */}
      <div style={{
        background: "#111827",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>ShopEZ (admin)</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Home</span>
          <span>Users</span>
          <span>Orders</span>
          <span>Products</span>
          <span>New Product</span>
          <span style={{ color: "#f87171", cursor: "pointer" }}>Logout</span>
        </div>
      </div>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "30px",
        padding: "40px"
      }}>

        <AdminCard title="Total users" value={stats.totalUsers} button="View all" />
        <AdminCard 
  title="All Products" 
  value={stats.totalProducts} 
  button="View all"
  onClick={() => navigate("/admin/products")}
/>
        <AdminCard 
  title="All Orders" 
  value={stats.totalOrders} 
  button="View all"
  onClick={() => navigate("/admin/orders")}
/>
        <AdminCard 
  title="Add Product" 
  value="(new)" 
  button="Add now"
  onClick={() => navigate("/admin/new-product")}
/>

      </div>

      {/* UPDATE BANNER */}
      <div style={{
        background: "#1f2937",
        margin: "40px",
        padding: "30px",
        borderRadius: "12px",
        maxWidth: "500px"
      }}>
        <h3>Update banner</h3>

        <input
          placeholder="Banner url"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            borderRadius: "6px",
            border: "none"
          }}
        />

        <button style={{
          marginTop: "15px",
          padding: "8px 20px",
          background: "#f97316",
          border: "none",
          borderRadius: "6px",
          color: "white",
          cursor: "pointer"
        }}>
          Update
        </button>
      </div>

    </div>
  );
}

function AdminCard({ title, value, button, onClick }) {
  return (
    <div style={{
      background: "#111827",
      padding: "25px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
    }}>
      <h4>{title}</h4>
      <h2 style={{ margin: "10px 0" }}>{value}</h2>
      <button
        onClick={onClick}
        style={{
          background: "transparent",
          border: "1px solid #f97316",
          color: "#f97316",
          padding: "6px 15px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {button}
      </button>
    </div>
  );
}

export default AdminDashboard;