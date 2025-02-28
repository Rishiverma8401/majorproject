module.exports = function(req, res, next) {
  // Make sure user is authenticated (auth middleware should run first)
  if (!req.user) {
    return res.status(401).json({ msg: 'Not authenticated' });
  }
  
  // Check for admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required' });
  }
  
  next();
};
