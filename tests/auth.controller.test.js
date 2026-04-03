const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const User = require('../src/models/User');
const RefreshToken = require('../src/models/RefreshToken');
const { login, refreshAccessToken, logout } = require('../src/controllers/authController');

process.env.JWT_SECRET = 'test-secret';

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
  await User.deleteMany({});
  await RefreshToken.deleteMany({});
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

test('login rejects unknown user', async () => {
  const req = { body: { email: 'missing@example.com', password: 'Password1!' } };
  const res = createRes();

  await login(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Invalid credentials');
});

test('login rejects wrong password', async () => {
  await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'Password1!',
    role: 'Admin',
    schoolId: new mongoose.Types.ObjectId()
  });

  const req = { body: { email: 'user@example.com', password: 'WrongPass1!' } };
  const res = createRes();

  await login(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Invalid credentials');
});

test('login returns token for valid credentials', async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'Password1!',
    role: 'Admin',
    schoolId: new mongoose.Types.ObjectId()
  });

  const req = { body: { email: 'USER@EXAMPLE.COM', password: 'Password1!' } };
  const res = createRes();

  await login(req, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.body.token);
  assert.ok(res.body.refreshToken);

  const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
  assert.equal(decoded.userId, String(user._id));
  assert.equal(decoded.role, 'Admin');
  assert.equal(decoded.schoolId, String(user.schoolId));

  const savedRefresh = await RefreshToken.findOne({ userId: user._id });
  assert.ok(savedRefresh);
});

test('refreshAccessToken returns a new access token when refresh token is valid', async () => {
  await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'Password1!',
    role: 'Admin',
    schoolId: new mongoose.Types.ObjectId()
  });

  const loginReq = { body: { email: 'user@example.com', password: 'Password1!' } };
  const loginRes = createRes();
  await login(loginReq, loginRes);

  const req = { body: { refreshToken: loginRes.body.refreshToken } };
  const res = createRes();
  await refreshAccessToken(req, res);

  assert.equal(res.statusCode, 200);
  assert.ok(res.body.accessToken);
});

test('logout revokes refresh token', async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'Password1!',
    role: 'Admin',
    schoolId: new mongoose.Types.ObjectId()
  });

  const loginReq = { body: { email: 'user@example.com', password: 'Password1!' } };
  const loginRes = createRes();
  await login(loginReq, loginRes);

  const req = { body: { refreshToken: loginRes.body.refreshToken } };
  const res = createRes();
  await logout(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, 'Logged out successfully');

  const storedToken = await RefreshToken.findOne({ userId: user._id });
  assert.ok(storedToken.revokedAt);
});
