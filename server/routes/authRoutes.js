// routes/authRoutes.js
// The "Routes Layer" for authentication. It only maps URLs to controller
// functions. There is no business logic here on purpose.

const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
