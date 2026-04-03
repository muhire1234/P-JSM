const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('express-async-errors');
const AppError = require('./src/errors/AppError');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

if (!process.env.MONGO_URI) {
  throw new AppError('MONGO_URI is required in environment', 500);
}
if (!process.env.JWT_SECRET) {
  throw new AppError('JWT_SECRET is required in environment', 500);
}

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
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);
