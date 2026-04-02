import { Navigate, useLocation } from "react-router-dom";
import { hasRole, useAuthStore } from "../features/auth/authStore";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasRole(user, roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
