// middleware/authenticate.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Get token after "Bearer"
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    // Verify the token using the secret stored in the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Attach the userId from the decoded token to the request
    next(); // Call next() to move to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
