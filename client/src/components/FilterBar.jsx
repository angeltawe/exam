// src/components/FilterBar.jsx
// The search/filter controls for the public feed. It keeps its own local form
// state and calls onApply(filters) when the user searches, or onReset() to clear.

import { useState } from "react";

const EMPTY = { city: "", type: "", minPrice: "", maxPrice: "" };

export default function FilterBar({ onApply }) {
  const [filters, setFilters] = useState(EMPTY);

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onApply(filters);
  }

  function handleReset() {
    setFilters(EMPTY);
    onApply(EMPTY);
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="field">
        <label>City</label>
        <input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="e.g. Paris"
        />
      </div>

      <div className="field">
        <label>Type</label>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Any</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
        </select>
      </div>

      <div className="field">
        <label>Min price</label>
        <input
          name="minPrice"
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      <div className="field">
        <label>Max price</label>
        <input
          name="maxPrice"
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Any"
        />
      </div>

      <div className="row">
        <button className="btn btn-primary" type="submit">
          Search
        </button>
        <button className="btn btn-outline" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
