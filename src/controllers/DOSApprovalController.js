const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');
const AppError = require('../errors/AppError');

const approveMissedExam = async (req, res) => {
  const { permissionId, action } = req.body; // action = 'APPROVE' | 'REJECT'

  // RBAC: only DOS
  if (req.user.role !== 'DOS') {
    throw new AppError('Forbidden', 403);
  }

  if (!['APPROVE', 'REJECT'].includes(action)) {
    throw new AppError('Invalid action', 400);
  }

  const permission = await Permission.findOne({ _id: permissionId, schoolId: req.user.schoolId });
  if (!permission || permission.type !== 'MISSED_EXAM') {
    throw new AppError('Invalid MISSED_EXAM permission', 400);
  }

  // Only pending permissions can be approved/rejected
  if (permission.status !== 'PENDING_DOS') {
    throw new AppError('Permission already processed', 400);
  }

  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  // Update approvals array
  permission.approvals.push({
    role: 'DOS',
    approvedBy: req.user.userId,
    approvedAt: new Date()
  });
  permission.status = status;
  await permission.save();

  // Audit log
  await AuditLog.create({
    action: action === 'APPROVE' ? 'DOS_APPROVE' : 'DOS_REJECT',
    entityType: 'Permission',
    entityId: permission._id,
    performedBy: req.user.userId
  });

  res.status(200).json(permission);
};

module.exports = { approveMissedExam };
