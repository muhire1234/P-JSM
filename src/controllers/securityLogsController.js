const SecurityLog = require('../models/SecurityLog');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

const logStudentExit = async (req, res) => {
  const { permissionId } = req.body;

  // RBAC: only Security
  if (req.user.role !== 'Security') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const permission = await Permission.findById(permissionId);
  if (!permission || permission.type !== 'LEAVE') {
    return res.status(400).json({ message: 'Invalid LEAVE permission' });
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
    return res.status(403).json({ message: 'Forbidden' });
  }

  const log = await SecurityLog.findById(logId);
  if (!log || log.returnedAt) {
    return res.status(400).json({ message: 'Invalid log or already returned' });
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