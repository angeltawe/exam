// repositories/propertyRepository.js
// Data-access layer for properties. Controllers describe WHAT they want
// (e.g. "properties in Paris under 1000") and this layer builds the actual
// MongoDB query.

const Property = require("../models/Property");

function create(data) {
  return Property.create(data);
}

// Build a filtered, public query. `filters` may contain city, minPrice,
// maxPrice, and type. We attach the owner's public info via populate().
function findWithFilters(filters = {}) {
  const query = {};

  if (filters.city) {
    // case-insensitive partial match, e.g. "par" matches "Paris".
    query.city = { $regex: filters.city, $options: "i" };
  }
  if (filters.type) {
    query.type = filters.type;
  }

  // Price range. Only add the bounds that were provided.
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  return Property.find(query)
    .populate("owner", "username name avatar")
    .sort({ createdAt: -1 });
}

function findByOwner(ownerId) {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 });
}

function findById(id) {
  return Property.findById(id).populate("owner", "username name avatar");
}

module.exports = {
  create,
  findWithFilters,
  findByOwner,
  findById,
};
