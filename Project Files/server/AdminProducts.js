import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/products", {
      headers: { Authorization: token }
    });

    const data = await res.json();

    if (res.ok) {
      setProducts(data);
    } else {
      alert("Access denied");
      navigate("/");
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ background: "#2b3440", minHeight: "100vh", padding: "40px", color: "white" }}>

      <h2>All Products</h2>

      <table style={{ width: "100%", marginTop: "30px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#111827" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product._id} style={{ textAlign: "center" }}>
              <td style={tdStyle}>{product.title}</td>
              <td style={tdStyle}>₹{product.price}</td>
              <td style={tdStyle}>{product.category}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => deleteProduct(product._id)}
                  style={{
                    background: "#ef4444",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
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

export default AdminProducts;