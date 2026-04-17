// Import JWT
const jwt = require('jsonwebtoken');

// Protect routes by checking for token
const protect = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    // Make sure token exists and has Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    // Continue to next step
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Export middleware
module.exports = { protect };