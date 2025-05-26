import React, { useState, useEffect } from "react";
import axios from "axios";
import { addToCart } from "../api";

const API_URL = "http://127.0.0.1:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle adding items to the cart
  const handleAddToCart = async (productId) => {
    setCartLoading(true);
    setCartMessage(""); // Reset the message

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated.");
        setCartMessage("Please log in to add items to the cart.");
        setCartLoading(false);
        return;
      }

      console.log("Sending Add to Cart Request:", {
        product_id: productId,
        quantity: 1,
      });

      const response = await addToCart(productId, token);
      console.log("Add to Cart Response:", response.data);
      setCartMessage("Item added to the cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      setCartMessage("Failed to add item to the cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Welcome to Samsung Store</h2>

      {cartMessage && <p className="cart-message">{cartMessage}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src =
                    "https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";
                  e.target.onerror = null;
                }}
              />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="add-to-cart"
                disabled={cartLoading} // Disable button while loading
              >
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
