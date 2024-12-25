import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated import
import { Link } from "react-router-dom";  // Link import to navigate

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Save JWT token to localStorage for authentication
      localStorage.setItem("token", response.data.token);

      // Set success message
      setSuccessMessage("Login successful! Redirecting to Dashboard...");

      // Redirect to Dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000); // 2 seconds delay
    } catch (err) {
      // Handle login error
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      {/* Show success message */}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* Show error message */}
      {error && <p className="error">{error}</p>}

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
