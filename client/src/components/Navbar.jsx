// src/components/Navbar.jsx
// The top navigation bar. It shows different links depending on whether the
// user is logged in, reading the current user from our global AuthContext.

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          🏠 PropSpace
        </Link>

        <nav className="nav-links">
          <Link to="/">Browse</Link>

          {user ? (
            <>
              <Link to="/dashboard">My Listings</Link>
              <Link to="/profile">Profile</Link>
              <span className="nav-user">Hi, {user.username}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
