import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/orders", {
      headers: { Authorization: token }
    });

    const data = await res.json();

    if (res.ok) {
      setOrders(data);
    } else {
      alert("Access denied");
      navigate("/");
    }
  };

  return (
    <div style={{ background: "#2b3440", minHeight: "100vh", padding: "40px", color: "white" }}>
      <h2>All Orders</h2>

      <table style={{ width: "100%", marginTop: "30px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#111827" }}>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Total Amount</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ textAlign: "center" }}>
              <td style={tdStyle}>{order.userId?.username}</td>
              <td style={tdStyle}>{order.userId?.email}</td>
              <td style={tdStyle}>₹{order.totalAmount}</td>
              <td style={tdStyle}>{order.items?.length}</td>
              <td style={tdStyle}>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #374151"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #374151"
};

export default AdminOrders;