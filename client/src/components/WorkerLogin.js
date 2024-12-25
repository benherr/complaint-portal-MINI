import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data being sent:", { email, password });

    try {
      // Send login request to the backend with correct API URL
      const response = await axios.post("http://localhost:5000/api/worker/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Check for successful response and save JWT token to localStorage
      if (response.data.token) {
        localStorage.setItem("workerToken", response.data.token);
        setSuccessMessage("Login successful! Redirecting to Worker Dashboard...");
        setTimeout(() => {
          navigate("/worker/dashboard");
        }, 1000);
      } else {
        setError("Login unsuccessful. Please check your credentials.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h2>Worker Login</h2>
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

      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default WorkerLogin;
