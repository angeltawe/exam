// utils/generateToken.js
// Creates a signed JWT (JSON Web Token) for a given user id.
// The token is what the frontend stores and sends back on future requests
// to prove the user is logged in.

const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign(
    { id: userId }, // the "payload" we want to remember about the user
    process.env.JWT_SECRET, // secret key only the server knows
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // auto-expiry
  );
}

module.exports = generateToken;
