// utils/asyncHandler.js
// A tiny helper that wraps an async controller function.
//
// Without it, every controller would need its own try/catch to forward errors
// to Express. This wrapper does that automatically: if the wrapped function
// rejects (throws), we call next(error) so our central errorHandler responds.

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
