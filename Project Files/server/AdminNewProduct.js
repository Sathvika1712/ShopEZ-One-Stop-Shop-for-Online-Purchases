import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminNewProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    mainImg: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Product added successfully!");
      navigate("/admin/products");
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <div style={{
      background: "#2b3440",
      minHeight: "100vh",
      padding: "40px",
      color: "white"
    }}>
      <h2>Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "30px",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="description" placeholder="Description" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="category" placeholder="Category" onChange={handleChange} required />
        <input name="mainImg" placeholder="Image URL" onChange={handleChange} required />

        <button
          type="submit"
          style={{
            background: "#f97316",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AdminNewProduct;