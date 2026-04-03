// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, getUsers, createRole } = require('../controllers/adminController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');

router.post('/user', authenticateJWT, authorizeRoles(['Admin']), validators.createUser, createUser);
router.get('/users', authenticateJWT, authorizeRoles(['Admin']), getUsers);
router.post('/role', authenticateJWT, authorizeRoles(['Admin']), validators.createRole, createRole);

module.exports = router;
