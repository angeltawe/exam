// src/components/Logo.jsx
// The PropSpace brand logo: a small "house + location pin" mark drawn as inline
// SVG, next to the wordmark. Inline SVG means the logo is crisp at any size and
// needs no image file. `variant="light"` is used on the dark navy navbar.

export default function Logo({ size = 30, variant = "dark", showText = true }) {
  // On the navy navbar we draw the badge in white; elsewhere in navy.
  const badge = variant === "light" ? "#ffffff" : "#0f2c4d";
  const mark = variant === "light" ? "#0f2c4d" : "#ffffff";
  const textColor = variant === "light" ? "#ffffff" : "#0f2c4d";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rounded badge */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill={badge} />
        {/* House roof + body */}
        <path
          d="M24 12 L36 22 V35 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 V22 Z"
          fill={mark}
        />
        {/* Door cut-out in badge color */}
        <rect x="21" y="27" width="6" height="10" rx="1" fill={badge} />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: size * 0.62,
            fontWeight: 700,
            letterSpacing: "0.2px",
            color: textColor,
            lineHeight: 1,
          }}
        >
          Prop<span style={{ fontWeight: 400 }}>Space</span>
        </span>
      )}
    </span>
  );
}
