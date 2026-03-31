// src/models/SecurityLog.js
const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  permissionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  checkedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // must be a Security staff
    required: true 
  },
  exitedAt: { type: Date, required: true },
  returnedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
