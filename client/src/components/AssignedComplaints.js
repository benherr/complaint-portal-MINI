import React, { useState, useEffect } from "react";
import axios from "axios";
import './AssignedComplaints.css';

function AssignedComplaints() {
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      const token = localStorage.getItem("workerToken");

      if (!token) {
        setError("Worker not logged in");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/worker/assigned-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignedComplaints(response.data);
      } catch (err) {
        setError("Failed to fetch assigned complaints");
      }
    };

    fetchAssignedComplaints();
  }, []);

  const handleUpdateStatus = async (complaintId, newStatus) => {
    const token = localStorage.getItem("workerToken");

    if (!token) {
      setError("Worker not logged in");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/worker/update-status/${complaintId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Status updated successfully!");

      setAssignedComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div>
      <h3>Assigned Complaints</h3>
      <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span>Status:</span>
        <button
          onClick={() => setActiveStatusFilter("all")}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              activeStatusFilter === "all"
                ? "linear-gradient(135deg,#667eea,#764ba2)"
                : "rgba(30,41,59,0.8)",
            color: "#f9fafb",
          }}
        >
          All
        </button>
        <button
          onClick={() => setActiveStatusFilter("pending")}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              activeStatusFilter === "pending"
                ? "linear-gradient(135deg,#f59e0b,#d97706)"
                : "rgba(30,41,59,0.8)",
            color: "#f9fafb",
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveStatusFilter("in progress")}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              activeStatusFilter === "in progress"
                ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                : "rgba(30,41,59,0.8)",
            color: "#f9fafb",
          }}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveStatusFilter("completed")}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background:
              activeStatusFilter === "completed"
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "rgba(30,41,59,0.8)",
            color: "#f9fafb",
          }}
        >
          Completed
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedComplaints.length > 0 ? (
            assignedComplaints
              .filter((complaint) => {
                if (activeStatusFilter === "all") return true;
                const status = (complaint.status || "pending").toLowerCase();
                return status === activeStatusFilter;
              })
              .map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.title}</td>
                <td>{complaint.department}</td>
                <td>{complaint.category}</td>
                <td>{complaint.description}</td>
                <td>{complaint.status || "Pending"}</td>
                <td>
                  {complaint.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(complaint._id, "in progress")
                      }
                    >
                      Start Work
                    </button>
                  )}
                  {complaint.status === "in progress" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(complaint._id, "completed")
                      }
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No assigned complaints found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssignedComplaints;
