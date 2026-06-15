// src/components/ProtectedRoute.jsx
// A route guard. Wrap any page that should only be visible to logged-in users.
// If there is no user, we redirect to /login and remember where they were
// trying to go (via location state) so we can send them back after login.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
