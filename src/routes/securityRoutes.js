// src/routes/securityRoutes.js
const express = require('express');
const router = express.Router();
const { logStudentExit, logStudentReturn } = require('../controllers/securityLogsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');

router.post('/exit', authenticateJWT, authorizeRoles(['Security']), logStudentExit);
router.post('/return', authenticateJWT, authorizeRoles(['Security']), logStudentReturn);

module.exports = router;