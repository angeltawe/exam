// middleware/authMiddleware.js
// The "protect" middleware is the backend's security guard. Any route that
// requires login puts this in front of its controller. It NEVER trusts the
// client blindly: it verifies the token on the server before letting the
// request through, then attaches the logged-in user to req.user.

const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const userRepository = require("../repositories/userRepository");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // The frontend sends the token in the header:  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // No token at all -> 401 Unauthorized.
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    // verify() throws if the token is fake, tampered with, or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look the user up so routes always work with fresh data.
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    req.user = user; // hand the user to the next controller
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed or expired");
  }
});

module.exports = { protect };
