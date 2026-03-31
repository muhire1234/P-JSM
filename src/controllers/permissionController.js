// src/controllers/permissionController.js
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

const createPermission = async (req, res) => {
  const { studentId, type, description } = req.body;

  // RBAC: only DOD
  if (req.user.role !== 'DOD') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Set initial status
  let status = type === 'LEAVE' ? 'APPROVED' : 'PENDING_DOS';

  const permission = await Permission.create({
    type,
    description,
    studentId,
    createdBy: req.user.userId,
    schoolId: req.user.schoolId,
    status
  });

  // Log audit
  await AuditLog.create({
    action: 'CREATE_PERMISSION',
    entityType: 'Permission',
    entityId: permission._id,
    performedBy: req.user.userId
  });

  res.status(201).json(permission);
};

module.exports = { createPermission };