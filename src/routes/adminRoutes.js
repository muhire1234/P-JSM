// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, getUsers, createRole } = require('../controllers/adminController'); // you can make this controller
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');

router.post('/user', authenticateJWT, authorizeRoles(['Admin']), createUser);
router.get('/users', authenticateJWT, authorizeRoles(['Admin']), getUsers);
router.post('/role', authenticateJWT, authorizeRoles(['Admin']), createRole);

module.exports = router;