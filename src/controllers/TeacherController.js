const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

const markAllowedExam = async (req, res) => {
  const { permissionId } = req.body;

  // RBAC: only Teacher
  if (req.user.role !== 'Teacher') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const permission = await Permission.findById(permissionId);
  if (!permission || permission.type !== 'MISSED_EXAM') {
    return res.status(400).json({ message: 'Invalid MISSED_EXAM permission' });
  }

  // Teacher can only act on approved permissions
  if (permission.status !== 'APPROVED') {
    return res.status(400).json({ message: 'Permission not approved by DOS' });
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