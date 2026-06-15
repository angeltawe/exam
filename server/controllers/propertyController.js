// controllers/propertyController.js
// Controller layer for property listings. This is where all the business
// rules live: validating input, enforcing ownership, and choosing the right
// HTTP status code for every outcome.

const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const propertyRepository = require("../repositories/propertyRepository");

const PROPERTY_TYPES = ["Apartment", "House", "Studio"];

// @desc    Public feed: list / search / filter all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { city, type, minPrice, maxPrice } = req.query;

  const filters = {};
  if (city) filters.city = city;
  if (type) filters.type = type;
  // Numbers arrive from the URL as strings, so convert them.
  if (minPrice !== undefined && minPrice !== "") filters.minPrice = Number(minPrice);
  if (maxPrice !== undefined && maxPrice !== "") filters.maxPrice = Number(maxPrice);

  const properties = await propertyRepository.findWithFilters(filters);
  res.status(200).json({ count: properties.length, properties });
});

// @desc    Private feed: only the listings I authored
// @route   GET /api/properties/mine
// @access  Private
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await propertyRepository.findByOwner(req.user._id);
  res.status(200).json({ count: properties.length, properties });
});

// @desc    View one property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = asyncHandler(async (req, res) => {
  // If the id is not a valid Mongo ObjectId, treat it as "not found".
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Property not found");
  }

  const property = await propertyRepository.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  res.status(200).json({ property });
});

// @desc    Create a new listing
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
  const { title, description, price, city, country, type, images, listingType } =
    req.body;

  // Validate required fields -> 400 Bad Request.
  if (!title || !description || price === undefined || !city || !country || !type) {
    res.status(400);
    throw new Error("Title, description, price, city, country, and type are required");
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    res.status(400);
    throw new Error("Price must be a number that is 0 or greater");
  }
  if (!PROPERTY_TYPES.includes(type)) {
    res.status(400);
    throw new Error("Type must be one of: Apartment, House, Studio");
  }

  const property = await propertyRepository.create({
    title,
    description,
    price: Number(price),
    city,
    country,
    type,
    images: Array.isArray(images) ? images : [],
    listingType: listingType === "sale" ? "sale" : "rent",
    owner: req.user._id, // the logged-in user becomes the author
  });

  res.status(201).json({ property });
});

// Shared helper: load a property and confirm the logged-in user owns it.
// Throws the right error (404 if missing, 403 if someone else's listing).
async function loadOwnedProperty(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Property not found");
  }

  const property = await propertyRepository.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // owner is populated, so compare its _id. This ownership check happens on
  // the SERVER and cannot be bypassed by the client.
  const ownerId = property.owner._id ? property.owner._id : property.owner;
  if (ownerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not allowed to modify someone else's listing");
  }

  return property;
}

// @desc    Update my listing
// @route   PUT /api/properties/:id
// @access  Private (author only)
const updateProperty = asyncHandler(async (req, res) => {
  const property = await loadOwnedProperty(req, res);

  const { title, description, price, city, country, type, images, listingType } =
    req.body;

  if (title !== undefined) property.title = title;
  if (description !== undefined) property.description = description;
  if (city !== undefined) property.city = city;
  if (country !== undefined) property.country = country;
  if (images !== undefined) property.images = Array.isArray(images) ? images : [];
  if (listingType !== undefined) {
    property.listingType = listingType === "sale" ? "sale" : "rent";
  }

  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      res.status(400);
      throw new Error("Price must be a number that is 0 or greater");
    }
    property.price = Number(price);
  }

  if (type !== undefined) {
    if (!PROPERTY_TYPES.includes(type)) {
      res.status(400);
      throw new Error("Type must be one of: Apartment, House, Studio");
    }
    property.type = type;
  }

  const updated = await property.save();
  res.status(200).json({ property: updated });
});

// @desc    Delete my listing
// @route   DELETE /api/properties/:id
// @access  Private (author only)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await loadOwnedProperty(req, res);
  await property.deleteOne();
  res.status(200).json({ message: "Property removed", id: req.params.id });
});

module.exports = {
  getProperties,
  getMyProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
