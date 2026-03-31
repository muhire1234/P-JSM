// src/models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['Admin', 'DOD', 'DOS', 'Teacher', 'Security'], 
    required: true,
    unique: true
  },
  permissions: [{ type: String }] // optional, for future granular access
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
