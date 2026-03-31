const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

// Create a new user (Admin only)
const createUser = async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Check required fields
  if (!name || !email || !password || !role || !schoolId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Optional: check if role exists
  const roleExists = await Role.findOne({ name: role });
  if (!roleExists) {
    return res.status(400).json({ message: 'Invalid role' });
  }

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
  if (!name) return res.status(400).json({ message: 'Role name required' });

  const existing = await Role.findOne({ name });
  if (existing) return res.status(400).json({ message: 'Role already exists' });

  const role = await Role.create({ name });
  res.status(201).json(role);
};

module.exports = { createUser, getUsers, createRole };
