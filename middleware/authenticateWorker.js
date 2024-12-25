const jwt = require("jsonwebtoken");

const authenticateWorker = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.worker = decoded;  // Store the decoded JWT payload (worker info) in req.worker

    // Check if the user is a worker
    if (req.worker.role !== "worker") {
      return res.status(403).json({ message: "You do not have worker privileges" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateWorker;
