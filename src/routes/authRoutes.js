// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // you can make this controller

router.post('/login', login);

module.exports = router;