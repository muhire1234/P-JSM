// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, refreshAccessToken, logout } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');
const { loginRateLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/login', loginRateLimiter, validators.login, login);
router.post('/refresh', validators.refreshToken, refreshAccessToken);
router.post('/logout', authenticateJWT, validators.refreshToken, logout);

module.exports = router;
