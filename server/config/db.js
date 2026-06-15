// config/db.js
// This file handles connecting to MongoDB using Mongoose.

const mongoose = require("mongoose");

// connectDB() tries to open a connection to the database.
// We "await" it inside server.js before starting the web server,
// because the app is useless without a working database.
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If we cannot reach the database, there is no point continuing.
    // We log the reason and stop the whole process.
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
