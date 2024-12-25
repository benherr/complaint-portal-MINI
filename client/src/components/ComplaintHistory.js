import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ComplaintHistory.css"; // Importing the CSS for styling

function ComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Assuming you have stored userId in localStorage after login

    if (!token) {
      navigate("/login"); // Redirect to login if no token
    } else {
      fetchComplaints(token);
    }
  }, [navigate]);

  const fetchComplaints = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching complaints. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="complaint-history-container">
      <h2 className="title">Complaint History</h2>
      {loading ? (
        <p className="loading-text">Loading complaints...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : complaints.length === 0 ? (
        <p className="no-complaints-text">No complaints found</p>
      ) : (
        <ul className="complaint-list">
          {complaints.map((complaint) => (
            <li key={complaint._id} className="complaint-item">
              <div className="complaint-header">
                <strong className="complaint-title">{complaint.title}</strong>
                <span className={`status ${complaint.status.toLowerCase()}`}>{complaint.status}</span>
              </div>
              <p className="complaint-description">{complaint.description}</p>
              {complaint.feedback && complaint.feedback.message && (
                <p className="complaint-feedback">
                  <strong>Feedback:</strong> {complaint.feedback.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComplaintHistory;
