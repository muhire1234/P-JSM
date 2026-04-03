const { test } = require('node:test');
const assert = require('node:assert/strict');

const validators = require('../src/middleware/validationMiddleware');

const createRes = () => {
  const headers = {};
  return {
    headers,
    set(key, value) {
      headers[key] = value;
    }
  };
};

test('login validator rejects invalid email', () => {
  const req = { body: { email: 'bad-email', password: 'Password1!' } };
  const res = createRes();
  let errFromNext = null;

  validators.login(req, res, (err) => {
    errFromNext = err;
  });

  assert.ok(errFromNext);
  assert.equal(errFromNext.statusCode, 400);
});

test('createUser validator accepts valid payload', () => {
  const req = {
    body: {
      name: 'Admin User',
      email: 'ADMIN@EXAMPLE.COM ',
      password: 'Password1!',
      role: 'Admin',
      schoolId: '507f1f77bcf86cd799439011'
    }
  };
  const res = createRes();
  let errFromNext = null;
  let calledNext = false;

  validators.createUser(req, res, (err) => {
    errFromNext = err;
    calledNext = true;
  });

  assert.equal(calledNext, true);
  assert.equal(errFromNext, undefined);
  assert.equal(req.body.email, 'admin@example.com');
});
