// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = adminAuth;
