// repositories/userRepository.js
// The "Data Repository Layer". Its only job is to talk to the database via the
// Mongoose model. Controllers call these functions instead of using the model
// directly, which keeps database details in one place and easy to change.

const User = require("../models/User");

function findByEmail(email, includePassword = false) {
  const query = User.findOne({ email: email.toLowerCase() });
  if (includePassword) query.select("+password");
  return query;
}

function findByUsername(username) {
  return User.findOne({ username });
}

function findById(id, includePassword = false) {
  const query = User.findById(id);
  if (includePassword) query.select("+password");
  return query;
}

function create(userData) {
  return User.create(userData);
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  create,
};
