const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) return res.status(400).json({ message: "Access Denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified
  
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

module.exports = auth;