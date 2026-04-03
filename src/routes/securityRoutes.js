// src/routes/securityRoutes.js
const express = require('express');
const router = express.Router();
const { logStudentExit, logStudentReturn } = require('../controllers/securityLogsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');

router.post('/exit', authenticateJWT, authorizeRoles(['Security']), validators.securityExit, logStudentExit);
router.post('/return', authenticateJWT, authorizeRoles(['Security']), validators.securityReturn, logStudentReturn);

module.exports = router;
