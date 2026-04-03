const AppError = require('../errors/AppError');

const createRateLimiter = ({ windowMs, maxRequests, keyGenerator }) => {
  const buckets = new Map();
  const keyFn = keyGenerator || ((req) => req.ip || 'unknown');

  return (req, res, next) => {
    const now = Date.now();
    const key = keyFn(req);
    const current = buckets.get(key);

    if (!current || now > current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return next(new AppError('Too many requests, please try again later', 429));
    }

    current.count += 1;
    return next();
  };
};

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10
});

module.exports = { createRateLimiter, loginRateLimiter };
