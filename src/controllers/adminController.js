const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');
const AppError = require('../errors/AppError');

// Create a new user (Admin only)
const createUser = async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Check required fields
  if (!name || !email || !password || !role || !schoolId) throw new AppError('All fields are required', 400);

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new AppError('User already exists', 400);

  // Optional: check if role exists
  const roleExists = await Role.findOne({ name: role });
  if (!roleExists) throw new AppError('Invalid role', 400);

  // Create user
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    schoolId
  });

  // Audit log
  await AuditLog.create({
    action: 'CREATE_USER',
    entityType: 'User',
    entityId: user._id,
    performedBy: req.user.userId
  });

  res.status(201).json({
    message: 'User created successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

// Optional: fetch all users (Admin)
const getUsers = async (req, res) => {
  const users = await User.find({ schoolId: req.user.schoolId }).select('-password');
  res.status(200).json(users);
};

// Optional: create a role (Admin)
const createRole = async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError('Role name required', 400);

  const existing = await Role.findOne({ name });
  if (existing) throw new AppError('Role already exists', 400);

  const role = await Role.create({ name });
  res.status(201).json(role);
};

module.exports = { createUser, getUsers, createRole };
