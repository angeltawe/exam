// controllers/userController.js
// Controller layer for the account/profile dashboard. Every function here
// runs AFTER the `protect` middleware, so we can trust that req.user is the
// currently logged-in account.

const asyncHandler = require("../utils/asyncHandler");
const userRepository = require("../repositories/userRepository");
const { publicUser } = require("./authController");

// @desc    Get the logged-in user's profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // protect() already loaded the user for us.
  res.status(200).json({ user: publicUser(req.user) });
});

// @desc    Update profile fields (name, phone, avatar)
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, phone, avatar } = req.body;

  // Only update fields that were actually sent. This lets the frontend send
  // just the changed field without wiping the others.
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  const updated = await user.save();
  res.status(200).json({ user: publicUser(updated) });
});

// @desc    Change password (must verify the current password first)
// @route   PUT /api/users/me/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new passwords are both required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  // req.user does not include the password (hidden by default), so reload it
  // with the password included to verify the current one.
  const user = await userRepository.findById(req.user._id, true);

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Assigning a new password triggers the model's pre-save hook to hash it.
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = { getMe, updateProfile, changePassword };
