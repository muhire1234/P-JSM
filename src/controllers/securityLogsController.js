const SecurityLog = require('../models/SecurityLog');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');
const AppError = require('../errors/AppError');

const logStudentExit = async (req, res) => {
  const { permissionId } = req.body;

  // RBAC: only Security
  if (req.user.role !== 'Security') {
    throw new AppError('Forbidden', 403);
  }

  const permission = await Permission.findOne({ _id: permissionId, schoolId: req.user.schoolId });
  if (!permission || permission.type !== 'LEAVE') {
    throw new AppError('Invalid LEAVE permission', 400);
  }

  if (permission.status !== 'APPROVED') {
    throw new AppError('LEAVE permission must be approved before exit logging', 400);
  }

  const openLog = await SecurityLog.findOne({ permissionId, returnedAt: null });
  if (openLog) {
    throw new AppError('Student exit already logged and not yet returned', 400);
  }

  const log = await SecurityLog.create({
    permissionId,
    studentId: permission.studentId,
    checkedBy: req.user.userId,
    exitedAt: new Date()
  });

  await AuditLog.create({
    action: 'LOG_EXIT',
    entityType: 'SecurityLog',
    entityId: log._id,
    performedBy: req.user.userId
  });

  res.status(201).json(log);
};

const logStudentReturn = async (req, res) => {
  const { logId } = req.body;

  // RBAC: only Security
  if (req.user.role !== 'Security') {
    throw new AppError('Forbidden', 403);
  }

  const log = await SecurityLog.findById(logId);
  if (!log || log.returnedAt) {
    throw new AppError('Invalid log or already returned', 400);
  }

  const permission = await Permission.findOne({ _id: log.permissionId, schoolId: req.user.schoolId });
  if (!permission) {
    throw new AppError('Permission not found for your school', 404);
  }

  log.returnedAt = new Date();
  await log.save();

  // Close the permission
  await Permission.findByIdAndUpdate(log.permissionId, { status: 'CLOSED' });

  await AuditLog.create({
    action: 'LOG_RETURN',
    entityType: 'SecurityLog',
    entityId: log._id,
    performedBy: req.user.userId
  });

  res.status(200).json(log);
};

module.exports = { logStudentExit, logStudentReturn };
