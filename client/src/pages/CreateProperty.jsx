// src/pages/CreateProperty.jsx
// Wraps the reusable PropertyForm and sends a POST to create a new listing.

import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyForm from "../components/PropertyForm";

export default function CreateProperty() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    await api.post("/properties", payload);
    // After creating, take the user to their "My Listings" dashboard.
    navigate("/dashboard");
  }

  return (
    <div className="container">
      <div className="card auth-box" style={{ maxWidth: 620 }}>
        <h1>Create a listing</h1>
        <PropertyForm onSubmit={handleCreate} submitLabel="Create listing" />
      </div>
    </div>
  );
}
