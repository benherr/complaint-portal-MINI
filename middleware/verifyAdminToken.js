// middleware/verifyAdminToken.js
const jwt = require("jsonwebtoken");

function verifyAdminToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.role !== "admin") throw new Error("Unauthorized");
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = verifyAdminToken;
