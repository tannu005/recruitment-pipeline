const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { dbQuery } = require('../utils/database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-berrywise-key-321';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      logger.warn(`Token verification failed: ${err.message}`);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    try {
      const dbUser = await dbQuery.get('SELECT id FROM users WHERE id = ?', [user.id]);
      if (!dbUser) {
        logger.warn(`User in token does not exist in database: ${user.id}`);
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
      req.user = user;
      next();
    } catch (dbError) {
      logger.error(`Database error during token auth: ${dbError.message}`);
      return res.status(500).json({ error: 'Internal server authentication error.' });
    }
  });
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  generateToken
};
