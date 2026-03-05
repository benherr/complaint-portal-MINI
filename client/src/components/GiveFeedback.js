import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function GiveFeedback() {
  const [complaint, setComplaint] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { complaintId } = useParams(); // Get the complaint ID from the URL
  const { success, error: showError } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchComplaintDetails();
    }
  }, [navigate, complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/complaints/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaint(response.data);
    } catch (error) {
      setError("Error fetching complaint details.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/feedback`,
        { text: feedbackText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      success("Feedback submitted successfully");
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to the dashboard after submission
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error submitting feedback.";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <div>
      <h2>Give Feedback for Complaint</h2>
      {complaint ? (
        <div>
          <h3>{complaint.title}</h3>
          <p>{complaint.description}</p>
          <h4>Feedback:</h4>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback here..."
              required
            />
            <button type="submit">Submit Feedback</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>Loading complaint details...</p>
      )}
    </div>
  );
}

export default GiveFeedback;
