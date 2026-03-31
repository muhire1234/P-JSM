const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('express-async-errors');

const app = express();

// Middleware
app.use(express.json());

// 🔥 CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => 
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const dosRoutes = require('./src/routes/dosApprovalRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const securityRoutes = require('./src/routes/securityRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/dos', dosRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});