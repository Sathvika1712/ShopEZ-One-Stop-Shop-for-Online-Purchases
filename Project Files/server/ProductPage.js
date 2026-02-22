import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products`)
      .then(res => res.json())
      .then(data => {
        const foundProduct = data.find(p => p._id === id);
        setProduct(foundProduct);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }
  const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <>
      {"★".repeat(fullStars)}
      {"☆".repeat(emptyStars)}
    </>
  );
};
const getDiscountedPrice = (price, discount) => {
  return Math.floor(price - (price * discount) / 100);
};
  return (
    <div style={{
      display: "flex",
      gap: "40px",
      padding: "40px",
      background: "#f1f3f6",
      minHeight: "100vh"
    }}>
      
      {/* LEFT SIDE IMAGE */}
      <div style={{ flex: 1 }}>
        <img
          src={product.mainImg}
          alt=""
          style={{
            width: "100%",
            height: "400px",
            objectFit: "contain",
            background: "white",
            padding: "20px",
            borderRadius: "10px"
          }}
        />
      </div>

      {/* RIGHT SIDE DETAILS */}
      <div style={{ flex: 1 }}>
        <h2>{product.title}</h2>

        <p style={{ marginTop: "10px", color: "#555" }}>
          {product.description}
        </p>

        <h3 style={{ marginTop: "20px" }}>
  ₹{getDiscountedPrice(product.price, product.discount)}
</h3>

<p style={{ textDecoration: "line-through", color: "gray" }}>
  ₹{product.price}
</p>

<p style={{ color: "green", fontWeight: "bold" }}>
  {product.discount}% off
</p>

        <button
          onClick={() => addToCart(product)}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#facc15",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductPage;