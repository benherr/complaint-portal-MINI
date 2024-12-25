import React, { useState, useEffect } from "react";
import axios from "axios";

function Feedbacks() {
  const [completedComplaints, setCompletedComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchCompletedComplaints = async () => {
      const token = localStorage.getItem("workerToken");

      if (!token) {
        setError("Worker not logged in");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/worker/completed-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompletedComplaints(response.data);
      } catch (err) {
        setError("Failed to fetch completed complaints");
      }
    };

    fetchCompletedComplaints();
  }, []);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback) {
      setError("Feedback cannot be empty");
      return;
    }

    const token = localStorage.getItem("workerToken");
    if (!token) {
      setError("Worker not logged in");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/worker/feedback/${selectedComplaintId}`,
        { feedback: { message: feedback } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Feedback submitted successfully!");
      setFeedback("");  // Clear feedback field
      setSelectedComplaintId(null); // Reset selected complaint
      // Optionally, refetch completed complaints to reflect the feedback
      setCompletedComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === selectedComplaintId
            ? { ...complaint, feedback: { message: feedback } }
            : complaint
        )
      );
    } catch (err) {
      setError("Failed to submit feedback");
    }
  };

  return (
    <div>
      <h3>Completed Complaints with Feedback</h3>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Feedback Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {completedComplaints.length > 0 ? (
            completedComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.title}</td>
                <td>{complaint.feedback?.message || "No feedback provided"}</td>
                <td>
                  {complaint.feedback ? (
                    <button disabled>Feedback Provided</button>
                  ) : (
                    <button onClick={() => setSelectedComplaintId(complaint._id)}>
                      Provide Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No completed complaints found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Feedback Form for Selected Complaint */}
      {selectedComplaintId && (
        <div>
          <h4>Provide Feedback for Complaint</h4>
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            rows="4"
            placeholder="Enter your feedback here"
          />
          <button onClick={handleSubmitFeedback}>Submit Feedback</button>
        </div>
      )}
    </div>
  );
}

export default Feedbacks;
