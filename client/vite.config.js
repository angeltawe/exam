import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config. The dev server runs on port 5173 (the default).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
