// models/User.js
// The User schema describes what a user document looks like in MongoDB,
// and contains the password-hashing logic so plain-text passwords are
// NEVER stored in the database.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return the password by default in queries
    },
    // Profile fields (editable from the account dashboard).
    name: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" }, // image URL
  },
  {
    // Adds createdAt / updatedAt timestamps automatically.
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // A "salt" adds random data so two identical passwords get different hashes.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ----- Helper to compare a login attempt with the stored hash -----
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
