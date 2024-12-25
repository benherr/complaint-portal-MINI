const express = require("express");
const bcrypt = require("bcryptjs");  // Add bcryptjs import
const jwt = require("jsonwebtoken");
const authenticateWorker = require("../middleware/authenticateWorker");
const Worker = require("../models/Worker"); // Import Worker model
const Complaint = require("../models/Complaint"); // Import Complaint model

const router = express.Router();

// Worker login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the worker by email
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If login is successful, generate a JWT token for the worker
    const token = jwt.sign(
      { id: worker._id, role: "worker" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the response with token and worker details
    res.json({
      message: "Login successful",
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        category: worker.category,
      },
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error to console
    res.status(500).json({ message: "Login failed" }); // Respond with a 500 error
  }
});

// Fetch assigned complaints for the worker
router.get("/assigned-complaints", authenticateWorker, async (req, res) => {
  try {
    const workerId = req.worker.id; // Get worker ID from JWT token

    // Find the complaints assigned to the worker
    const complaints = await Complaint.find({ assignedWorker: workerId });

    // If no complaints are assigned to the worker
    if (complaints.length === 0) {
      return res.status(404).json({ message: "No assigned complaints found" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching assigned complaints:", error);
    res.status(500).json({ message: "Failed to fetch assigned complaints" });
  }
});

// Fetch feedback for completed complaints assigned to the worker
router.get("/completed-complaints-feedback", authenticateWorker, async (req, res) => {
  try {
    const workerId = req.worker.id; // Get worker ID from JWT token

    // Find the completed complaints assigned to the worker
    const complaints = await Complaint.find({
      assignedWorker: workerId,
      status: "Completed",
      "feedback.message": { $ne: null },  // Check if there is feedback
    }).populate("feedback.student", "name email"); // Populate student info with feedback

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No completed complaints with feedback found" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching feedback for completed complaints:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// Update the status of a complaint
router.put("/update-status/:complaintId", authenticateWorker, async (req, res) => {
  const { status } = req.body; // New status (in progress, completed)
  const { complaintId } = req.params; // Get the complaintId from the URL

  try {
    const workerId = req.worker.id; // Get worker ID from JWT token

    // Find the complaint by ID
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if the complaint is assigned to the current worker
    if (complaint.assignedWorker.toString() !== workerId) {
      return res.status(403).json({ message: "You are not authorized to update this complaint" });
    }

    // Update the status of the complaint
    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: "Complaint status updated successfully", complaint });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
