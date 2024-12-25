import React, { useState } from "react";
import axios from "axios";
import './complaintForm.css';


function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !department || !category || !description) {
      setError("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("department", department);
    formData.append("category", category);
    formData.append("description", description);
    if (media) formData.append("media", media);

    try {
      setLoading(true);
      setError(""); // Reset error state
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/complaints/submit", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Success
      alert("Complaint submitted successfully!");
      setTitle("");
      setDepartment("");
      setCategory("");
      setDescription("");
      setMedia(null); // Reset form state
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error occurred while submitting the complaint.");
      } else {
        setError("Server error, please try again later.");
      }
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error messages */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
         <option value="">Select Department</option>
          <option value="ec">EC</option>
          <option value="mca">MCA</option>
          <option value="it">IT</option>
          <option value="cs">CS</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Catogory</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="carpentry">Carpentry</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="file" onChange={(e) => setMedia(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
