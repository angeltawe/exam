// src/main.jsx
// The entry point of the React app. It wraps the whole app in:
//   - BrowserRouter: enables client-side routing (URLs without page reloads)
//   - AuthProvider:  makes the logged-in user available everywhere

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
