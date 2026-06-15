// server.js
// This is the entry point of the backend. It:
//   1. Loads environment variables from .env
//   2. Connects to MongoDB
//   3. Creates the Express app and registers middleware + routes
//   4. Starts listening for HTTP requests

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to the database before anything else.
connectDB();

const app = express();

// ----- Global middleware -----

// Allow the frontend (running on a different port) to call this API.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Parse incoming JSON request bodies into req.body.
app.use(express.json());

// ----- Routes -----

// A simple health-check route so we can confirm the server is alive.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "PropSpace API is running" });
});

// (Auth, user, and property routes are added in later modules.)

// ----- Error handling (must be registered AFTER the routes) -----
app.use(notFound);
app.use(errorHandler);

// ----- Start the server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
