// src/components/UserNavbar.jsx
import React from 'react';
import '../styles/Navbar.css'; // Import the CSS file
import logo from '../assets/images/logo.png'; // Import the logo

function UserNavbar() {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <h2>User Dashboard</h2>
      <div className="nav-links">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
}

export default UserNavbar;
