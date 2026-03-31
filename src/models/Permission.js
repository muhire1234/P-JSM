// src/models/Permission.js
const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['DOD', 'DOS', 'Teacher', 'Security'], 
    required: true 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedAt: { type: Date }
}, { _id: false });

const PermissionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['LEAVE', 'MISSED_EXAM'], 
    required: true 
  },
  description: { type: String, required: true },

  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },

  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true 
  },

  status: {
    type: String,
    enum: [
      'PENDING_DOS',
      'APPROVED',
      'REJECTED',
      'CLOSED'
    ],
    default: 'PENDING_DOS'
  },

  approvals: [ApprovalSchema]

}, { timestamps: true });

module.exports = mongoose.model('Permission', PermissionSchema);
