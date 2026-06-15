// src/App.jsx
// Defines the app layout (a shared Navbar on every page) and the route table.
// New routes (auth, dashboard, profile, property details) are added in the
// modules that follow.

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* More routes are added in later modules. */}
          <Route path="*" element={<div className="container"><h2>404 — Page not found</h2></div>} />
        </Routes>
      </main>
    </>
  );
}
