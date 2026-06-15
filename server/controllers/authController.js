// controllers/authController.js
// The "Controller / Service Layer" for authentication.
// It validates input, applies business rules, talks to the repository,
// and decides which HTTP status code to send back.

const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const userRepository = require("../repositories/userRepository");

// Build the safe public shape of a user (never include the password).
function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar,
  };
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Basic validation -> 400 Bad Request if anything is missing.
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email, and password are all required");
  }

  // 2. Make sure the email and username are not already taken.
  const emailTaken = await userRepository.findByEmail(email);
  if (emailTaken) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const usernameTaken = await userRepository.findByUsername(username);
  if (usernameTaken) {
    res.status(400);
    throw new Error("This username is already taken");
  }

  // 3. Create the user. The model's pre-save hook hashes the password.
  const user = await userRepository.create({ username, email, password });

  // 4. Respond 201 Created with the user and a fresh login token.
  res.status(201).json({
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// @desc    Log a user in
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // We must explicitly ask for the password because it is hidden by default.
  const user = await userRepository.findByEmail(email, true);

  // Use the SAME generic message whether the email or the password is wrong,
  // so attackers cannot tell which emails are registered.
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

module.exports = { register, login, publicUser };
