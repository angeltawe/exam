// routes/propertyRoutes.js
// Property routes following RESTful conventions.
//
// IMPORTANT: the specific "/mine" route is declared BEFORE "/:id".
// Otherwise Express would treat "mine" as an :id value and never reach it.

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProperties,
  getMyProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const router = express.Router();

// Public feed + create
router
  .route("/")
  .get(getProperties) // public: list / search / filter
  .post(protect, createProperty); // private: create

// Private "My Listings" feed
router.get("/mine", protect, getMyProperties);

// Single property by id
router
  .route("/:id")
  .get(getProperty) // public: view one
  .put(protect, updateProperty) // private: author only
  .delete(protect, deleteProperty); // private: author only

module.exports = router;
