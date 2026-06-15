// src/api/axios.js
// A single, shared Axios instance for talking to the backend.
//
// The "request interceptor" runs before EVERY request and automatically
// attaches the saved JWT token. This is the "Global Interceptor" pattern:
// we write the auth logic once here instead of repeating it in every call.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// --- Attach the token to outgoing requests ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Handle expired/invalid tokens globally ---
// If the server ever replies 401, the token is no longer valid, so we clear
// it and bounce the user to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid redirect loops if we are already on the login page.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
