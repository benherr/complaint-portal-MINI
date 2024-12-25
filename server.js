const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Import path module
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Import adminRoutes
const workerRoutes = require("./routes/workerRoutes"); // Import workerRoutes (newly added)
require("dotenv").config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Update the path to serve files

// Routes
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes); // Add adminRoutes for admin login
app.use("/api/worker", workerRoutes); // Keep this as "/api/worker" (No change here)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if connection fails
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
