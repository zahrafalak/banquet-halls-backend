const requireAdmin = (req, res, next) => {
  const roles = req.auth?.payload?.["https://banquet-halls-api/roles"] || [];
  if (!roles.includes("admin")) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { requireAdmin };