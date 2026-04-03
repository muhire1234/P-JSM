// src/routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const { createPermission } = require('../controllers/permissionController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');

router.post('/', authenticateJWT, authorizeRoles(['DOD']), validators.createPermission, createPermission);
router.get('/', authenticateJWT, authorizeRoles(['DOD', 'Admin']), (req, res) => {
    // Optional: fetch permissions for DOD/Admin
});

module.exports = router;
