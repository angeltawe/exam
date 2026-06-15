// src/pages/CreateProperty.jsx
// Wraps the reusable PropertyForm and sends a POST to create a new listing.

import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyForm from "../components/PropertyForm";

export default function CreateProperty() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    const { data } = await api.post("/properties", payload);
    // Go straight to the new listing's detail page.
    navigate(`/properties/${data.property._id}`);
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
