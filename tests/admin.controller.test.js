const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Role = require('../src/models/Role');
const AuditLog = require('../src/models/AuditLog');
const { createUser } = require('../src/controllers/adminController');

let mongo;

before(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
});

after(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Role.deleteMany({}),
    AuditLog.deleteMany({})
  ]);
});

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

test('createUser hashes password, normalizes email, and writes audit log', async () => {
  await Role.create({ name: 'Admin' });

  const req = {
    body: {
      name: 'Test User',
      email: 'ADMIN@EXAMPLE.COM',
      password: 'Password1!',
      role: 'Admin',
      schoolId: new mongoose.Types.ObjectId()
    },
    user: { userId: new mongoose.Types.ObjectId() }
  };
  const res = createRes();

  await createUser(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.message, 'User created successfully');

  const saved = await User.findOne({ email: 'admin@example.com' }).select('+password');
  assert.ok(saved);
  assert.notEqual(saved.password, 'Password1!');
  const matches = await bcrypt.compare('Password1!', saved.password);
  assert.equal(matches, true);

  const audit = await AuditLog.findOne({ entityType: 'User', entityId: saved._id });
  assert.ok(audit);
  assert.equal(String(audit.performedBy), String(req.user.userId));
});
