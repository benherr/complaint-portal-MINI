import React, { useState, useEffect } from "react";
import axios from "axios";
import './adminDashboard.css';
import AddWorker from "./AddWorker";
import WorkerList from "./WorkerList";


function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("manageComplaints"); // Track the active section
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workerError, setWorkerError] = useState(null);
  const [workerSuccess, setWorkerSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin not logged in");
        setLoading(false);
        return;
      }

      try {
        const complaintsResponse = await axios.get("http://localhost:5000/api/admin/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(complaintsResponse.data);

        const workersResponse = await axios.get("http://localhost:5000/api/admin/workers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkers(workersResponse.data);
      } catch (err) {
        setError("Failed to fetch complaints or workers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <button onClick={() => setActiveSection("manageComplaints")}>Manage Complaints</button>
        <button onClick={() => setActiveSection("manageWorkers")}>Manage Workers</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === "manageComplaints" && (
          <section>
            <h3>Complaints List</h3>
            {error && <div className="error">{error}</div>}
            {complaints.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>{complaint.title}</td>
                      <td>{complaint.department}</td>
                      <td>{complaint.category}</td>
                      <td>{complaint.description}</td>
                      <td>{complaint.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No complaints found.</p>
            )}
          </section>
        )}

        {activeSection === "manageWorkers" && (
          <div>
            <AddWorker setWorkerSuccess={setWorkerSuccess} setWorkerError={setWorkerError} />
            <div className="worker-list-container">
              <WorkerList workers={workers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
