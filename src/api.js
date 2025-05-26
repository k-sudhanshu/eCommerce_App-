
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

// User Registration
export const registerUser = (userData) =>
  axios.post(`${API_URL}/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });

// User Login
export const loginUser = (credentials) =>
  axios.post(`${API_URL}/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });

// Fetch All Products
export const fetchProducts = () => axios.get(`${API_URL}/products`);

// Logout User
export const logoutUser = () => axios.delete(`${API_URL}/logout`);

// Add item to cart
export const addToCart = (productId, token) =>
  axios.post(
    `${API_URL}/cart/add`,
    { product_id: productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// Fetch user cart
export const getCart = (token) =>
  axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Remove item from cart
export const removeFromCart = (cartId, token) =>
  axios.post(
    `${API_URL}/cart/remove`,
    { cart_id: cartId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
