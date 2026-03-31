// src/routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const { createPermission } = require('../controllers/permissionController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');

router.post('/', authenticateJWT, authorizeRoles(['DOD']), createPermission);
router.get('/', authenticateJWT, authorizeRoles(['DOD', 'Admin']), (req, res) => {
    // Optional: fetch permissions for DOD/Admin
});

module.exports = router;