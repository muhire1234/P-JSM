// src/routes/dosApprovalRoutes.js
const express = require('express');
const router = express.Router();
const { approveMissedExam } = require('../controllers/DOSApprovalController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');

router.put('/approve', authenticateJWT, authorizeRoles(['DOS']), approveMissedExam);

module.exports = router;