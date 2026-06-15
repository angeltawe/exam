// src/components/Navbar.jsx
// The top navigation bar. It shows the PropSpace logo and icon-labelled links,
// and on small screens collapses into a toggleable menu (a "hamburger").

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

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
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <Logo variant="light" size={30} />
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <FiMenu />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            <FiHome className="icon" /> Browse
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                <FiGrid className="icon" /> My Listings
              </Link>
              <Link to="/profile" onClick={closeMenu}>
                <FiUser className="icon" /> Profile
              </Link>
              <span className="nav-user">
                <FiUser className="icon" /> {user.username}
              </span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                <FiLogOut className="icon" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <FiLogIn className="icon" /> Login
              </Link>
              <Link to="/register" className="btn btn-light btn-sm" onClick={closeMenu}>
                <FiUserPlus className="icon" /> Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
