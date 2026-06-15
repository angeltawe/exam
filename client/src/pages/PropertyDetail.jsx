// src/pages/PropertyDetail.jsx
// Public page showing a single property's full details. Reads the :id from the
// URL, fetches that property, and handles loading / not-found / error states.

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

const PLACEHOLDER = "https://placehold.co/800x500?text=No+Image";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/properties/${id}`, {
          signal: controller.signal,
        });
        setProperty(data.property);
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 404) {
          setError("This property does not exist or has been removed.");
        } else {
          setError("Could not load this property. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  if (loading) return <Loader text="Loading property..." />;

  if (error) {
    return (
      <div className="container">
        <Message type="error">{error}</Message>
        <Link to="/" className="btn btn-outline">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const image = property.images?.[0] || PLACEHOLDER;

  return (
    <div className="container">
      <Link to="/" className="muted">
        ← Back to browse
      </Link>

      <div className="card" style={{ marginTop: 12 }}>
        <img
          src={image}
          alt={property.title}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 8 }}
        />

        <div className="page-head" style={{ marginTop: 16 }}>
          <h1 style={{ margin: 0 }}>{property.title}</h1>
          <div className="price" style={{ fontSize: "1.4rem" }}>
            ${Number(property.price).toLocaleString()}
          </div>
        </div>

        <p>
          <span className="badge">{property.type}</span>{" "}
          <span className="badge">For {property.listingType}</span>
        </p>

        <p className="muted">
          📍 {property.city}, {property.country}
        </p>

        <h3>Description</h3>
        <p>{property.description}</p>

        {property.owner && (
          <>
            <h3>Listed by</h3>
            <p className="muted">
              {property.owner.name || property.owner.username}
            </p>
          </>
        )}

        {/* Show extra images if there are any */}
        {property.images?.length > 1 && (
          <>
            <h3>More photos</h3>
            <div className="row">
              {property.images.slice(1).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${property.title} ${i + 2}`}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  style={{ width: 160, height: 110, objectFit: "cover", borderRadius: 8 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
