const AppError = require('../errors/AppError');

const isObjectIdLike = (value) => typeof value === 'string' && /^[a-fA-F0-9]{24}$/.test(value);

const validate = (rules) => (req, res, next) => {
  const errors = [];

  for (const rule of rules) {
    const value = req.body[rule.field];
    const present = value !== undefined && value !== null && value !== '';

    if (rule.required && !present) {
      errors.push(`${rule.field} is required`);
      continue;
    }

    if (!present) continue;

    if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`${rule.field} must be a string`);
      continue;
    }

    if (rule.type === 'email') {
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        errors.push(`${rule.field} must be a valid email`);
        continue;
      }
      req.body[rule.field] = value.trim().toLowerCase();
    }

    if (rule.type === 'objectId' && !isObjectIdLike(value)) {
      errors.push(`${rule.field} must be a valid ObjectId`);
      continue;
    }

    if (rule.type === 'string' && typeof value === 'string') {
      const trimmed = value.trim();
      req.body[rule.field] = trimmed;

      if (rule.minLength && trimmed.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`${rule.field} must be one of: ${rule.enum.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  return next();
};

const validators = {
  login: validate([
    { field: 'email', required: true, type: 'email' },
    { field: 'password', required: true, type: 'string', minLength: 8 }
  ]),
  refreshToken: validate([
    { field: 'refreshToken', required: true, type: 'string', minLength: 10 }
  ]),
  createPermission: validate([
    { field: 'studentId', required: true, type: 'objectId' },
    { field: 'type', required: true, type: 'string', enum: ['LEAVE', 'MISSED_EXAM'] },
    { field: 'description', required: true, type: 'string', minLength: 3 }
  ]),
  dosApproval: validate([
    { field: 'permissionId', required: true, type: 'objectId' },
    { field: 'action', required: true, type: 'string', enum: ['APPROVE', 'REJECT'] }
  ]),
  teacherApproval: validate([
    { field: 'permissionId', required: true, type: 'objectId' }
  ]),
  securityExit: validate([
    { field: 'permissionId', required: true, type: 'objectId' }
  ]),
  securityReturn: validate([
    { field: 'logId', required: true, type: 'objectId' }
  ]),
  createUser: validate([
    { field: 'name', required: true, type: 'string', minLength: 2 },
    { field: 'email', required: true, type: 'email' },
    { field: 'password', required: true, type: 'string', minLength: 8 },
    { field: 'role', required: true, type: 'string', enum: ['Admin', 'DOD', 'DOS', 'Teacher', 'Security'] },
    { field: 'schoolId', required: true, type: 'objectId' }
  ]),
  createRole: validate([
    { field: 'name', required: true, type: 'string', enum: ['Admin', 'DOD', 'DOS', 'Teacher', 'Security'] }
  ])
};

module.exports = validators;
