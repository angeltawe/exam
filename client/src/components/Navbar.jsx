// src/components/Navbar.jsx
// The top navigation bar. On small screens it collapses into a toggleable menu
// (a "hamburger") so it stays usable on phones.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  // Close the mobile menu after tapping any link.
  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          PropSpace CM
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Browse
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                My Listings
              </Link>
              <Link to="/profile" onClick={closeMenu}>
                Profile
              </Link>
              <span className="nav-user">Hi, {user.username}</span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-light btn-sm" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
