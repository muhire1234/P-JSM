const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');

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
});

const buildUser = () => ({
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'Password1!',
  role: 'Admin',
  schoolId: new mongoose.Types.ObjectId()
});

test('hashes password on updateOne', async () => {
  const user = await User.create(buildUser());

  await User.updateOne({ _id: user._id }, { password: 'NewPassword1!' });

  const updated = await User.findById(user._id).select('+password');
  assert.ok(updated);
  assert.notEqual(updated.password, 'NewPassword1!');
  const matches = await bcrypt.compare('NewPassword1!', updated.password);
  assert.equal(matches, true);
});

test('hashes password on findOneAndUpdate', async () => {
  const user = await User.create(buildUser());

  await User.findByIdAndUpdate(user._id, { password: 'AnotherPass1!' });

  const updated = await User.findById(user._id).select('+password');
  assert.ok(updated);
  assert.notEqual(updated.password, 'AnotherPass1!');
  const matches = await bcrypt.compare('AnotherPass1!', updated.password);
  assert.equal(matches, true);
});
