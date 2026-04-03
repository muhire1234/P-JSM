// src/routes/dosApprovalRoutes.js
const express = require('express');
const router = express.Router();
const { approveMissedExam } = require('../controllers/DOSApprovalController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');

router.put('/approve', authenticateJWT, authorizeRoles(['DOS']), validators.dosApproval, approveMissedExam);

module.exports = router;
