import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState(""); // Added state for username
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!username || !name || !email || !password) {
      setError("Username, name, email, and password are required.");
      return;
    }

    try {
      // Send registration request to the backend, including username
      const response = await axios.post("http://localhost:5000/api/users/register", {
        username,  // Include username in the registration payload
        name,
        email,
        password,
      });

      // Set success message and show it
      setSuccessMessage("Registration successful! Redirecting to login...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1000); // 2 seconds delay
    } catch (err) {
      // Log the error response from the backend if available
      console.error(err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Input for Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Show success message */}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* Show error message */}
      {error && <p className="error">{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
