const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createAccessToken, createRefreshToken, hashToken } = require('../utils/tokenUtils');

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Find user
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
    schoolId: user.schoolId
  });
  const refreshToken = createRefreshToken({ userId: user._id });
  const decoded = jwt.decode(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000)
  });

  // Backward compatibility: keep "token" while adding a modern token pair.
  res.status(200).json({ token: accessToken, accessToken, refreshToken });
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  if (decoded.type !== 'refresh') {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const storedToken = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
    revokedAt: null
  });
  if (!storedToken) return res.status(401).json({ message: 'Refresh token revoked or not found' });
  if (storedToken.expiresAt.getTime() <= Date.now()) return res.status(401).json({ message: 'Refresh token expired' });

  const user = await User.findById(decoded.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
    schoolId: user.schoolId
  });

  res.status(200).json({ accessToken });
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  const tokenHash = hashToken(refreshToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { login, refreshAccessToken, logout };
