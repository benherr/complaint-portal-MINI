const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // For hashing passwords
const authenticateAdmin = require("../middleware/authenticateAdmin"); // Admin authentication middleware
const Complaint = require("../models/Complaint");
const Worker = require("../models/Worker"); // Worker model

const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all complaints (admin-only)
router.get("/complaints", authenticateAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints." });
  }
});

// Get all workers (admin-only)
router.get("/workers", authenticateAdmin, async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Failed to fetch workers." });
  }
});

// Add a new worker (admin-only)
router.post("/add-worker", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    const validCategories = ["plumber", "electrician", "carpenter"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category. Choose from plumber, electrician, or carpenter." });
    }

    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({ message: "Worker with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      category,
    });

    await newWorker.save();
    res.status(201).json({ message: "Worker added successfully", worker: { name: newWorker.name, email: newWorker.email, category: newWorker.category } });
  } catch (error) {
    console.error("Error adding worker:", error);
    res.status(500).json({ message: "Failed to add worker." });
  }
});

// Assign a worker to a complaint (admin-only)
router.post("/assign-worker", authenticateAdmin, async (req, res) => {
  try {
    const { complaintId, workerId } = req.body;

    if (!complaintId || !workerId) {
      return res.status(400).json({ message: "Complaint ID and Worker ID are required" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    complaint.assignedWorker = workerId;
    await complaint.save();
    res.status(200).json({ message: "Worker assigned successfully", complaint });
  } catch (error) {
    console.error("Error assigning worker:", error);
    res.status(500).json({ message: "Failed to assign worker" });
  }
});

// Worker login route
router.post("/worker-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: worker._id, role: "worker" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, worker: { id: worker._id, name: worker.name, email: worker.email, category: worker.category } });
  } catch (error) {
    console.error("Worker login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
