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
import Dashboard from "./pages/Dashboard";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* "/new" must come before "/:id" so it is not read as an id. */}
          <Route
            path="/properties/new"
            element={
              <ProtectedRoute>
                <CreateProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id/edit"
            element={
              <ProtectedRoute>
                <EditProperty />
              </ProtectedRoute>
            }
          />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* The profile route is added in the final module. */}
          <Route path="*" element={<div className="container"><h2>404 — Page not found</h2></div>} />
        </Routes>
      </main>
    </>
  );
}
