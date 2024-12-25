const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);  // Log the decoded token for debugging
    req.user = decoded;  // Store the decoded JWT payload (user info) in req.user

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have admin privileges" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);  // Log the error for debugging
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateAdmin;
