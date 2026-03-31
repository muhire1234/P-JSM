// src/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { markAllowedExam } = require('../controllers/TeacherController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddlleware');

router.put('/allow-exam', authenticateJWT, authorizeRoles(['Teacher']), markAllowedExam);

module.exports = router;