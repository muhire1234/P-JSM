const AppError = require('../errors/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err.stack || err);
  }

  const payload = {
    message: err.message || 'Something went wrong'
  };

  if (err.details) payload.details = err.details;

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = { notFound, errorHandler };
