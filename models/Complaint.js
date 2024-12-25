const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    status: { type: String, default: "Pending" },
    feedback: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model who gave feedback
        text: { type: String }, // Feedback message
        createdAt: { type: Date, default: Date.now }, // Timestamp for when feedback was given
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // Ensure every complaint is associated with a user
    },
  },
  { timestamps: true } // Add timestamps to track creation and update time
);

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
