// src/models/AuditLog.js
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action:
   { type: String, 
    required: true 
  },       // e.g., "CREATE_PERMISSION", "APPROVE_MISSED_EXAM"
  entityType: 
  { type: String,
     required: true 
    },   // e.g., "Permission", "Student", "SecurityLog"
  entityId:
   { type: mongoose.Schema.Types.ObjectId,
     required: true
     }, // reference to affected record
  performedBy:
   { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  timestamp:
   Date.now 
  });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
