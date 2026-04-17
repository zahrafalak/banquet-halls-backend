const requireAdmin = (req, res, next) => {
  const permissions = req.auth?.payload?.permissions || [];
  if (!permissions.includes('admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { requireAdmin };