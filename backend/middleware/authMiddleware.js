const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded.id; // attach user id to request
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};