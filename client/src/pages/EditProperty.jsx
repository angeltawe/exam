// src/pages/EditProperty.jsx
// Loads an existing listing, prefills the reusable PropertyForm, and sends a
// PUT to update it. The backend still enforces that only the author can edit.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyForm from "../components/PropertyForm";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const { data } = await api.get(`/properties/${id}`, {
          signal: controller.signal,
        });
        const p = data.property;
        // Convert the form's shape: images array -> newline-separated text.
        setInitial({
          title: p.title,
          description: p.description,
          price: p.price,
          city: p.city,
          country: p.country,
          type: p.type,
          listingType: p.listingType,
          imagesText: (p.images || []).join("\n"),
        });
      } catch (err) {
        if (err.name === "CanceledError") return;
        setError("Could not load this listing for editing.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  async function handleUpdate(payload) {
    await api.put(`/properties/${id}`, payload);
    // After saving changes, return to the "My Listings" dashboard.
    navigate("/dashboard");
  }

  if (loading) return <Loader text="Loading listing..." />;
  if (error) {
    return (
      <div className="container">
        <Message type="error">{error}</Message>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card auth-box" style={{ maxWidth: 620 }}>
        <h1>Edit listing</h1>
        <PropertyForm
          initial={initial}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
