const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');
const AppError = require('../errors/AppError');

const markAllowedExam = async (req, res) => {
  const { permissionId } = req.body;

  // RBAC: only Teacher
  if (req.user.role !== 'Teacher') {
    throw new AppError('Forbidden', 403);
  }

  const permission = await Permission.findOne({ _id: permissionId, schoolId: req.user.schoolId });
  if (!permission || permission.type !== 'MISSED_EXAM') {
    throw new AppError('Invalid MISSED_EXAM permission', 400);
  }

  // Teacher can only act on approved permissions
  if (permission.status !== 'APPROVED') {
    throw new AppError('Permission not approved by DOS', 400);
  }

  // Update approvals array
  permission.approvals.push({
    role: 'Teacher',
    approvedBy: req.user.userId,
    approvedAt: new Date()
  });

  await permission.save();

  // Audit log
  await AuditLog.create({
    action: 'TEACHER_ALLOW_EXAM',
    entityType: 'Permission',
    entityId: permission._id,
    performedBy: req.user.userId
  });

  res.status(200).json(permission);
};

module.exports = { markAllowedExam };
