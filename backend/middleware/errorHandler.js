function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === "ValidationError") status = 400;
  if (err.code === 11000) status = 409;
  if (err.name === "CastError") status = 400;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

module.exports = { asyncHandler, notFound, errorHandler };
