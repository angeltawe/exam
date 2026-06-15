// src/utils/format.js
// Small formatting helpers shared across the app.

// Cameroon uses the Central African CFA franc (XAF), shown as "FCFA".
// We format with space thousands-separators, e.g. 1200000 -> "1 200 000 FCFA".
export function formatPrice(amount) {
  const number = Number(amount) || 0;
  return `${number.toLocaleString("fr-FR")} FCFA`;
}

// The main cities/towns in Cameroon, offered as suggestions in forms/filters.
export const CAMEROON_CITIES = [
  "Douala",
  "Yaoundé",
  "Bamenda",
  "Bafoussam",
  "Buea",
  "Limbe",
  "Kribi",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kumba",
  "Edéa",
  "Dschang",
];

// Property categories used across the app.
export const PROPERTY_TYPES = ["Apartment", "House", "Studio"];
