const { test } = require('node:test');
const assert = require('node:assert/strict');

const { createRateLimiter } = require('../src/middleware/rateLimitMiddleware');

const createRes = () => {
  const headers = {};
  return {
    headers,
    set(key, value) {
      headers[key] = value;
    }
  };
};

test('rate limiter blocks requests after max threshold', () => {
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 });
  const req = { ip: '127.0.0.1' };
  const res = createRes();

  let thirdErr = null;

  limiter(req, res, () => {});
  limiter(req, res, () => {});
  limiter(req, res, (err) => {
    thirdErr = err;
  });

  assert.ok(thirdErr);
  assert.equal(thirdErr.statusCode, 429);
  assert.ok(res.headers['Retry-After']);
});
