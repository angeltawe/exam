// src/pages/PropertyDetail.jsx
// Public page showing a single property's full details in a professional,
// two-column layout: a photo gallery on the left and a sticky summary/contact
// panel on the right. Reads the :id from the URL, fetches that property, and
// handles loading / not-found / error states. Prices are shown in FCFA.

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiEdit2, FiInfo, FiMapPin, FiUser, FiArrowLeft } from "react-icons/fi";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";

const PLACEHOLDER = "https://placehold.co/800x500?text=No+Image";

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState("");
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
        setActiveImage(data.property.images?.[0] || PLACEHOLDER);
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

  // Show a friendly message for any error OR if no property came back, so we
  // never crash to a blank page (e.g. if the backend is unreachable).
  if (error || !property) {
    return (
      <div className="container">
        <Message type="error">
          {error || "This property could not be loaded."}
        </Message>
        <Link to="/" className="btn btn-outline">
          <FiArrowLeft /> Back to browse
        </Link>
      </div>
    );
  }

  // Is the logged-in user the author of this listing?
  const ownerId = property.owner?._id || property.owner;
  const isOwner = user && ownerId && user.id === ownerId;
  const images = property.images?.length ? property.images : [PLACEHOLDER];

  return (
    <div className="container">
      <Link to="/" className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <FiArrowLeft /> Back to browse
      </Link>

      <div className="page-head" style={{ marginTop: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{property.title}</h1>
          <p className="muted" style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
            <FiMapPin /> {property.city}, {property.country}
          </p>
        </div>
        <div className="row">
          <span className="badge">{property.type}</span>
          <span className="badge">For {property.listingType}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* ---- Left: gallery ---- */}
        <div className="detail-gallery">
          <img
            className="main"
            src={activeImage}
            alt={property.title}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          />
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${property.title} ${i + 1}`}
                  onClick={() => setActiveImage(url)}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  style={{
                    cursor: "pointer",
                    outline: url === activeImage ? "2px solid var(--navy)" : "none",
                  }}
                />
              ))}
            </div>
          )}

          <div className="card" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Description</h2>
            <p style={{ whiteSpace: "pre-line" }}>{property.description}</p>
          </div>
        </div>

        {/* ---- Right: summary + contact ---- */}
        <aside>
          <div className="card">
            <div className="detail-price">{formatPrice(property.price)}</div>
            <p className="muted" style={{ marginTop: 4 }}>
              {property.listingType === "rent" ? "per month" : "sale price"}
            </p>

            <div className="facts">
              <div className="fact">
                <div className="label">Type</div>
                <div className="value">{property.type}</div>
              </div>
              <div className="fact">
                <div className="label">Listing</div>
                <div className="value">For {property.listingType}</div>
              </div>
              <div className="fact">
                <div className="label">City</div>
                <div className="value">{property.city}</div>
              </div>
              <div className="fact">
                <div className="label">Country</div>
                <div className="value">{property.country}</div>
              </div>
            </div>

            {isOwner ? (
              <>
                <div className="message message-info" style={{ marginBottom: 12 }}>
                  <FiInfo /> This is your listing — you can edit or delete it.
                </div>
                <Link to={`/properties/${property._id}/edit`} className="btn btn-primary btn-block">
                  <FiEdit2 /> Edit this listing
                </Link>
              </>
            ) : (
              <>
                <div className="notice-warn" style={{ marginBottom: 12 }}>
                  <FiInfo /> This listing belongs to another user. You can&apos;t edit
                  or delete other people&apos;s listings.
                </div>
                <div className="card" style={{ background: "var(--bg)", marginTop: 4 }}>
                  <h3 className="section-title" style={{ fontSize: "1.05rem" }}>
                    <FiUser /> Listed by
                  </h3>
                  {property.owner ? (
                    <>
                      <p className="muted" style={{ margin: 0 }}>
                        {property.owner.name || property.owner.username}
                      </p>
                      <p className="muted" style={{ margin: "4px 0 0" }}>
                        Sign in and reach out through PropSpace to enquire.
                      </p>
                    </>
                  ) : (
                    <p className="muted" style={{ margin: 0 }}>Lister details unavailable.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
