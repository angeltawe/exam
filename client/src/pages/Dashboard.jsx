// src/pages/Dashboard.jsx
// The private "My Listings" screen. Fetches only the logged-in user's
// properties and lets them create, edit, or delete each one.

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatPrice } from "../utils/format";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadMine = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/properties/mine", { signal });
      setProperties(data.properties);
    } catch (err) {
      if (err.name === "CanceledError") return;
      setError("Could not load your listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadMine(controller.signal);
    return () => controller.abort();
  }, [loadMine]);

  async function handleDelete(id) {
    // Simple confirmation so a listing is never deleted by accident.
    if (!window.confirm("Delete this listing permanently?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/properties/${id}`);
      // Remove it from the list locally instead of refetching everything.
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete this listing.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>My Listings</h1>
        <Link to="/properties/new" className="btn btn-primary">
          + New listing
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading your listings..." />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : properties.length === 0 ? (
        <div className="empty">
          <h3>You have no listings yet</h3>
          <p>Create your first property to see it here.</p>
          <Link to="/properties/new" className="btn btn-primary">
            Create a listing
          </Link>
        </div>
      ) : (
        <div className="grid">
          {properties.map((p) => (
            <div key={p._id} className="property-card">
              <img
                src={p.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
                alt={p.title}
                onError={(e) =>
                  (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")
                }
              />
              <div className="body">
                <span className="badge">
                  {p.type} · For {p.listingType}
                </span>
                <h3 style={{ margin: "4px 0" }}>{p.title}</h3>
                <div className="muted">
                  {p.city}, {p.country}
                </div>
                <div className="price">{formatPrice(p.price)}</div>

                <div className="row" style={{ marginTop: 8 }}>
                  <Link to={`/properties/${p._id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                  <Link to={`/properties/${p._id}/edit`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                  >
                    {deletingId === p._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
