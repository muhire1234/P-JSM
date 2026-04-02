const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const createAccessToken = ({ userId, role, schoolId }) => {
  return jwt.sign(
    { userId, role, schoolId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TTL || process.env.JWT_EXPIRES_IN || '8h' }
  );
};

const createRefreshToken = ({ userId }) => {
  const tokenId = crypto.randomBytes(32).toString('hex');
  return jwt.sign(
    { userId, tokenId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TTL || '7d' }
  );
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { createAccessToken, createRefreshToken, hashToken };
