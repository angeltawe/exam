// models/Property.js
// A Property is a single listing in the marketplace. Each property is linked
// to the user who created it via the `owner` field (a reference to a User _id).
// This relationship is how we later enforce "only the author can edit/delete".

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Property type is required"],
      // enum restricts the value to this fixed set of options.
      enum: {
        values: ["Apartment", "House", "Studio"],
        message: "Type must be Apartment, House, or Studio",
      },
    },
    images: {
      type: [String], // a list of image URLs
      default: [],
    },
    listingType: {
      type: String,
      enum: ["rent", "sale"],
      default: "rent",
    },
    // Link to the User who created this listing.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
