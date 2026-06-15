// src/pages/Home.jsx
// The public property feed. Anyone (even logged-out guests) can browse, search,
// and filter listings here.
//
// Lifecycle notes (best practice):
//   - We fetch inside useEffect so the request runs after the component mounts.
//   - We use an AbortController and abort it in the cleanup function so that if
//     the component unmounts (or filters change mid-request), the old request is
//     cancelled. This prevents "set state on an unmounted component" leaks.

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useCallback so this function identity is stable across renders.
  const fetchProperties = useCallback(async (activeFilters, signal) => {
    setLoading(true);
    setError("");
    try {
      // Build query params, skipping empty values.
      const params = {};
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) params[key] = value;
      });

      const { data } = await api.get("/properties", { params, signal });
      setProperties(data.properties);
    } catch (err) {
      // Ignore the error that fires when WE cancelled the request on purpose.
      if (err.name === "CanceledError") return;
      setError("Could not load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProperties(filters, controller.signal);

    // Cleanup: cancel the request if filters change or the page unmounts.
    return () => controller.abort();
  }, [filters, fetchProperties]);

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <h1>Find your next home in Cameroon</h1>
          <p>Apartments, houses, and studios for rent or sale — from Douala to Yaoundé.</p>
        </div>
      </section>

      <div className="container">
        <FilterBar onApply={setFilters} />

      {/* Async UX states: loading -> error -> empty -> results */}
      {loading ? (
        <Loader text="Loading properties..." />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : properties.length === 0 ? (
        <div className="empty">
          <h3>No properties found</h3>
          <p>Try widening your search filters.</p>
        </div>
      ) : (
        <div className="grid">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
