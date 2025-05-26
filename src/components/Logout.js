import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser();
        localStorage.removeItem("token"); // Fixed `removeItem`
        alert("Logged out successfully");
        navigate("/login"); // Redirect to login page
      } catch (error) {
        alert("Logout failed");
      }
    };

    handleLogout();
  }, [navigate]); // Fixed dependency array syntax

  return (
    <div className="container">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
