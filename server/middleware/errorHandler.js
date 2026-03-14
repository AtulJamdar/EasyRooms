/**
 * Simple error handler middleware for Express.
 * Logs the error and returns an appropriate response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
