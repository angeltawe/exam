// src/components/PropertyCard.jsx
// A small reusable card that previews one property in the feed grid.
// It is "dumb": it only receives a property object and displays it, which
// makes it reusable on the public feed AND the dashboard.

import { Link } from "react-router-dom";

// A neutral placeholder image when a listing has no photos.
const PLACEHOLDER = "https://placehold.co/600x400?text=No+Image";

export default function PropertyCard({ property }) {
  const image = property.images?.[0] || PLACEHOLDER;

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <img
        src={image}
        alt={property.title}
        // If the URL is broken, fall back to the placeholder instead of a
        // broken-image icon.
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER;
        }}
      />
      <div className="body">
        <span className="badge">
          {property.type} · For {property.listingType}
        </span>
        <h3 style={{ margin: "4px 0" }}>{property.title}</h3>
        <div className="muted">
          {property.city}, {property.country}
        </div>
        <div className="price">${Number(property.price).toLocaleString()}</div>
      </div>
    </Link>
  );
}
