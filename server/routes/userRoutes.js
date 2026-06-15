// routes/userRoutes.js
// Account/profile routes. Every route here is private, so we put the
// `protect` guard in front of each controller.

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);

module.exports = router;
