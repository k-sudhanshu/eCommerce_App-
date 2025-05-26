import React, { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("Please log in to view your cart.");
      setLoading(false);
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await getCart(token);
        setCartItems(response.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setMessage("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      await removeFromCart(cartId, token);
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      setMessage("Item removed from cart.");
    } catch (err) {
      console.error("Error removing item:", err);
      setMessage("Failed to remove item. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {message && <p className="cart-message">{message}</p>}
      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div key={item.cart_id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-image" />
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <button onClick={() => handleRemoveFromCart(item.cart_id)} className="remove-btn">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
