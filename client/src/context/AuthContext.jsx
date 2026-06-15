// src/context/AuthContext.jsx
// Global authentication state shared across the whole app using React Context.
// Any component can read the current user or call login/register/logout
// without "prop drilling" (passing props down many levels).

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialise from localStorage so a page refresh keeps the user logged in.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Helper to persist the user + token after login/register.
  function persistSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(form) {
    const { data } = await api.post("/auth/register", form);
    persistSession(data);
    return data.user;
  }

  async function login(form) {
    const { data } = await api.post("/auth/login", form);
    persistSession(data);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  // Let other parts of the app update the cached user (e.g. after editing
  // the profile) so the navbar avatar/name stays in sync.
  function updateCachedUser(updatedUser) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const value = { user, loading, setLoading, register, login, logout, updateCachedUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Small custom hook so components can just call useAuth().
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
