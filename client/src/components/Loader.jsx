// src/components/Loader.jsx
// A small reusable spinner shown while data is loading.
// Reusing one component keeps the "Loading..." state consistent everywhere.

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
