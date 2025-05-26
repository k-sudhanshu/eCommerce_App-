import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";

import "./styles/styles.css";

function App() {
  // State for filters
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    name: "",
  });

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home filters={filters} setFilters={setFilters} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
