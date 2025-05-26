import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="nav-brand">Samsung Store</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/cart" className={`nav-item ${location.pathname === "/cart" ? "active" : ""}`}>
            Cart
          </Link>
        </li>
        <li>
          <Link to="/register" className={`nav-item ${location.pathname === "/register" ? "active" : ""}`}>
            Register
          </Link>        
        </li>
        {!isLoggedIn ? (
          <li>
            <Link to="/login" className={`nav-item ${location.pathname === "/login" ? "active" : ""}`}>
              Login
            </Link>
          </li>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Dark Mode Toggle */}
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light" : "Dark"} Mode
      </button>
    </nav>
  );
};

export default Navbar;

