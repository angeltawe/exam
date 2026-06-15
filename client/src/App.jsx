// src/App.jsx
// Defines the app layout (a shared Navbar on every page) and the route table.
// New routes (auth, dashboard, profile, property details) are added in the
// modules that follow.

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetail from "./pages/PropertyDetail";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          {/* Protected routes (dashboard, profile) are added in later modules. */}
          <Route path="*" element={<div className="container"><h2>404 — Page not found</h2></div>} />
        </Routes>
      </main>
    </>
  );
}
