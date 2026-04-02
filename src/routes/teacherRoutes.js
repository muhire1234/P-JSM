// src/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { markAllowedExam } = require('../controllers/TeacherController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');
const validators = require('../middleware/validationMiddleware');

router.put('/allow-exam', authenticateJWT, authorizeRoles(['Teacher']), validators.teacherApproval, markAllowedExam);

module.exports = router;
