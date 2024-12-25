import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component
import AssignedComplaints from "./AssignedComplaints"; // Import AssignedComplaints component
import Feedbacks from "./Feedbacks"; // Import Feedbacks component
import './WorkerDashboard.css'; // CSS for layout

function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('assignedComplaints'); // Track active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar handleTabChange={handleTabChange} />

      {/* Content area */}
      <div className="content">
        {activeTab === 'assignedComplaints' && <AssignedComplaints />}
        {activeTab === 'feedbacks' && <Feedbacks />}
      </div>
    </div>
  );
}

export default WorkerDashboard;
