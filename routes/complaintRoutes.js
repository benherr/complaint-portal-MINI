const express = require("express");
const multer = require("multer");
const Complaint = require("../models/Complaint");
const authenticate = require("../middleware/authenticate");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// Set up file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Submit a complaint
router.post("/submit", authenticate, upload.single("media"), async (req, res) => {
  try {
    const { title, department, category, description } = req.body;
    const complaint = new Complaint({
      title,
      department,
      category,
      description,
      media: req.file ? req.file.path : null,
      userId: req.userId,
    });
    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all complaints for admin
router.get("/all", verifyAdminToken, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single complaint by its ID (for details, including feedback)
router.get("/:complaintId", authenticate, async (req, res) => {
  const { complaintId } = req.params;
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add feedback to a completed complaint
router.put("/:complaintId/feedback", authenticate, async (req, res) => {
  const { complaintId } = req.params;
  const { text } = req.body;

  try {
    // Find the complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Ensure the complaint is completed before allowing feedback
    if (complaint.status !== "completed") {
      return res.status(400).json({ message: "You can only provide feedback for completed complaints" });
    }

    // Add feedback to the complaint
    complaint.feedback.push({
      userId: req.userId,
      text,
    });

    await complaint.save();
    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
