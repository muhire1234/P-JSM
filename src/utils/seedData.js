const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('../models/Role');
const User = require('../models/User');

const DEFAULT_ROLES = ['Admin', 'DOD', 'DOS', 'Teacher', 'Security'];

const getSchoolId = () => {
  const value = process.env.SEED_SCHOOL_ID;
  if (value && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return new mongoose.Types.ObjectId();
};

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }
  await mongoose.connect(process.env.MONGO_URI);
};

const closeDb = async () => {
  await mongoose.connection.close();
};

const seedRoles = async () => {
  for (const roleName of DEFAULT_ROLES) {
    await Role.findOneAndUpdate(
      { name: roleName },
      { $setOnInsert: { name: roleName, permissions: [] } },
      { upsert: true, new: true }
    );
  }

  console.log(`Seeded roles: ${DEFAULT_ROLES.join(', ')}`);
};

const seedAdminAndUsers = async () => {
  const schoolId = getSchoolId();
  const users = [
    {
      name: process.env.SEED_ADMIN_NAME || 'System Admin',
      email: (process.env.SEED_ADMIN_EMAIL || 'admin@pjms.local').toLowerCase(),
      password: process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!',
      role: 'Admin',
      schoolId
    },
    {
      name: 'Default DOD',
      email: 'dod@pjms.local',
      password: 'DodPass123!',
      role: 'DOD',
      schoolId
    },
    {
      name: 'Default DOS',
      email: 'dos@pjms.local',
      password: 'DosPass123!',
      role: 'DOS',
      schoolId
    },
    {
      name: 'Default Teacher',
      email: 'teacher@pjms.local',
      password: 'TeacherPass123!',
      role: 'Teacher',
      schoolId
    },
    {
      name: 'Default Security',
      email: 'security@pjms.local',
      password: 'SecurityPass123!',
      role: 'Security',
      schoolId
    }
  ];

  for (const userData of users) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) {
      console.log(`Skipped existing user: ${userData.email}`);
      continue;
    }
    await User.create(userData);
    console.log(`Created user: ${userData.email} (${userData.role})`);
  }
};

module.exports = {
  connectDb,
  closeDb,
  seedRoles,
  seedAdminAndUsers
};
