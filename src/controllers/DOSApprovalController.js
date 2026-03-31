const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

const approveMissedExam = async (req, res) => {
  const { permissionId, action } = req.body; // action = 'APPROVE' | 'REJECT'

  // RBAC: only DOS
  if (req.user.role !== 'DOS') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const permission = await Permission.findById(permissionId);
  if (!permission || permission.type !== 'MISSED_EXAM') {
    return res.status(400).json({ message: 'Invalid MISSED_EXAM permission' });
  }

  // Only pending permissions can be approved/rejected
  if (permission.status !== 'PENDING_DOS') {
    return res.status(400).json({ message: 'Permission already processed' });
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