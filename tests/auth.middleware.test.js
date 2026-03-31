const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { authenticateJWT } = require('../src/middleware/authmiddlleware');

process.env.JWT_SECRET = 'test-secret';

const createRes = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
  return res;
};

test('rejects missing authorization header', () => {
  const req = { headers: {} };
  const res = createRes();
  let nextCalled = false;

  authenticateJWT(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'No token provided');
});

test('rejects invalid authorization format', () => {
  const req = { headers: { authorization: 'Token abc' } };
  const res = createRes();
  let nextCalled = false;

  authenticateJWT(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Invalid authorization format');
});

test('accepts valid bearer token', () => {
  const token = jwt.sign(
    { userId: 'user123', role: 'Admin', schoolId: 'school123' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createRes();
  let nextCalled = false;

  authenticateJWT(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
  assert.equal(req.user.userId, 'user123');
  assert.equal(req.user.role, 'Admin');
  assert.equal(req.user.schoolId, 'school123');
});
