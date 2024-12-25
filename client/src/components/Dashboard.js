import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "./ComplaintForm";
import ComplaintHistory from "./ComplaintHistory";
import "./Dashboard.css";
import "../App.css";
import "./Navbar.css";



function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("complaintForm");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">Dashboard</h3>
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <button onClick={() => handleSidebarClick("complaintForm")} className="sidebar-button">
              Submit Complaint
            </button>
          </li>
          <li className="sidebar-item">
            <button onClick={() => handleSidebarClick("complaintHistory")} className="sidebar-button">
              Complaint History
            </button>
          </li>
          <li className="logout-item">
            <button onClick={handleLogout} className="sidebar-button logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!isLoggedIn ? (
          <p>Loading...</p>
        ) : (
          <div>
            {activeComponent === "complaintForm" && <ComplaintForm />}
            {activeComponent === "complaintHistory" && <ComplaintHistory />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
