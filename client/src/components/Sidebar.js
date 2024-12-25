import React from "react";

function Sidebar({ handleTabChange }) {
  const handleLogout = () => {
    localStorage.removeItem("workerToken"); // Remove the token
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <div className="sidebar">
      <h3>Worker Dashboard</h3>
      <ul>
        <li>
          <button onClick={() => handleTabChange('assignedComplaints')}>Assigned Complaints</button>
        </li>
        <li>
          <button onClick={() => handleTabChange('feedbacks')}>Feedbacks</button>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
