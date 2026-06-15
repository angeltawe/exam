// middleware/errorMiddleware.js
// Central place to handle "route not found" and any errors thrown anywhere
// in the app. Keeping this logic in one place means our controllers can simply
// `throw` an error and trust that the response shape stays consistent.

// Runs when no route matched the request URL -> 404 Not Found.
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.method} ${req.originalUrl}`));
}

// The final error handler. Express recognises it as an error handler
// because it has FOUR arguments (err, req, res, next).
function errorHandler(err, req, res, next) {
  // If a controller already set a status code (e.g. 400/401), keep it.
  // Otherwise default to 500 (Internal Server Error).
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    // Only show the technical stack trace while developing, never in production.
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
