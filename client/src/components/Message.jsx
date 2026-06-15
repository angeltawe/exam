// src/components/Message.jsx
// A reusable colored banner for errors, success notices, or empty/info states.
// `type` controls the color: "error" (red), "success" (green), "info" (blue).

export default function Message({ type = "info", children }) {
  if (!children) return null;
  return <div className={`message message-${type}`}>{children}</div>;
}
