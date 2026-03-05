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
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        text: { type: String }, 
        createdAt: { type: Date, default: Date.now },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true, 
    },
  },
  { timestamps: true } 
);

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
