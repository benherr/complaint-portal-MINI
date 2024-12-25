import React, { useState } from "react";
import axios from "axios";
import './AddWorker.css';


function AddWorker({ setWorkerSuccess, setWorkerError }) {
  const [workerName, setWorkerName] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [workerPassword, setWorkerPassword] = useState("");
  const [workerCategory, setWorkerCategory] = useState("");
  const [workerError, setWorkerErrorState] = useState(null); // Track error state
  const [workerSuccess, setWorkerSuccessState] = useState(null); // Track success state

  const handleAddWorker = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!workerName || !workerEmail || !workerPassword || !workerCategory) {
      setWorkerErrorState("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-worker",
        { name: workerName, email: workerEmail, password: workerPassword, category: workerCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWorkerSuccessState(response.data.message);
      setWorkerErrorState(null);
      setWorkerName("");
      setWorkerEmail("");
      setWorkerPassword("");
      setWorkerCategory("");
    } catch (err) {
      setWorkerErrorState("Failed to add worker. Please try again.");
      setWorkerSuccessState(null);
    }
  };

  return (
    <section className="add-worker-container">
      <h3>Add a Worker</h3>
      <form onSubmit={handleAddWorker} className="add-worker-form">
        <input
          type="text"
          placeholder="Worker Name"
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Worker Email"
          value={workerEmail}
          onChange={(e) => setWorkerEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Worker Password"
          value={workerPassword}
          onChange={(e) => setWorkerPassword(e.target.value)}
          className="input-field"
        />
        <select
          value={workerCategory}
          onChange={(e) => setWorkerCategory(e.target.value)}
          className="input-field"
        >
          <option value="">Select Category</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="carpenter">Carpenter</option>
        </select>
        <button type="submit" className="submit-button">Add Worker</button>
      </form>
      {workerError && <div className="error">{workerError}</div>}
      {workerSuccess && <div className="success">{workerSuccess}</div>}
    </section>
  );
}

export default AddWorker;
