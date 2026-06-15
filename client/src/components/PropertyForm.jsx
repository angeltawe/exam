// src/components/PropertyForm.jsx
// One reusable form used for BOTH creating and editing a listing. The parent
// page decides what to do on submit (POST vs PUT) and passes initial values.
// Reusing one form avoids duplicating all this markup and validation twice.
//
// Localised for Cameroon: country defaults to Cameroon, the city field suggests
// Cameroonian cities, and the price is in FCFA.

import { useState, useRef } from "react";
import InputField from "./InputField";
import Message from "./Message";
import { CAMEROON_CITIES, PROPERTY_TYPES } from "../utils/format";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  city: "",
  country: "Cameroon",
  type: "Apartment",
  listingType: "rent",
  imagesText: "", // one image URL per line; converted to an array on submit
};

export default function PropertyForm({ initial, onSubmit, submitLabel = "Save" }) {
  // Merge any initial values (edit mode) over the empty defaults.
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Show the error and make sure the user actually sees it, even on a long form.
  function showError(text) {
    setError(text);
    // Wait for the message to render, then scroll it into view.
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function validate() {
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0) {
      return "Price must be a number that is 0 or greater.";
    }
    if (!form.city.trim()) return "City is required.";
    if (!form.country.trim()) return "Country is required.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

    // Turn the multi-line text into a clean array of image URLs.
    const images = form.imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        city: form.city,
        country: form.country,
        type: form.type,
        listingType: form.listingType,
        images,
      });
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitting(false); // let the user fix and retry
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div ref={errorRef}>
        <Message type="error">{error}</Message>
      </div>

      <InputField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Spacious 2-bedroom in Bonapriso"
        required
      />
      <InputField
        label="Description"
        name="description"
        as="textarea"
        value={form.description}
        onChange={handleChange}
        placeholder="Describe the property..."
        required
      />

      <div className="row">
        <div className="field" style={{ flex: 1, minWidth: 140 }}>
          <label>
            Type <span className="required">*</span>
          </label>
          <select name="type" value={form.type} onChange={handleChange}>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ flex: 1, minWidth: 140 }}>
          <label>
            Listing <span className="required">*</span>
          </label>
          <select name="listingType" value={form.listingType} onChange={handleChange}>
            <option value="rent">For rent</option>
            <option value="sale">For sale</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div style={{ flex: 1, minWidth: 140 }}>
          <InputField
            label="Price (FCFA)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="150000"
            required
          />
        </div>
        <div className="field" style={{ flex: 1, minWidth: 140 }}>
          <label>
            City <span className="required">*</span>
          </label>
          <input
            name="city"
            list="cm-cities-form"
            value={form.city}
            onChange={handleChange}
            placeholder="Douala"
          />
          <datalist id="cm-cities-form">
            {CAMEROON_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <InputField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Cameroon"
            required
          />
        </div>
      </div>

      <InputField
        label="Image URLs (one per line)"
        name="imagesText"
        as="textarea"
        value={form.imagesText}
        onChange={handleChange}
        placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
      />

      {/* Repeat the error here so it is visible right next to the button. */}
      <Message type="error">{error}</Message>

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
