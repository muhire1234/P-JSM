const jwt = require('jsonwebtoken');

// Authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const [scheme, token] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (role, userId, schoolId)
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Authorize roles
const authorizeRoles = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

module.exports = { authenticateJWT, authorizeRoles };
