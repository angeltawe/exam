// src/components/FilterBar.jsx
// The search/filter controls for the public feed. It keeps its own local form
// state and calls onApply(filters) when the user searches, or resets to clear.
// City suggestions are Cameroonian cities, prices are in FCFA.

import { useState } from "react";
import { CAMEROON_CITIES, PROPERTY_TYPES } from "../utils/format";

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
          list="cm-cities"
          value={filters.city}
          onChange={handleChange}
          placeholder="e.g. Douala"
        />
        <datalist id="cm-cities">
          {CAMEROON_CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="field">
        <label>Type</label>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Any</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Min price (FCFA)</label>
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
        <label>Max price (FCFA)</label>
        <input
          name="maxPrice"
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Any"
        />
      </div>

      <div className="filter-actions">
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
