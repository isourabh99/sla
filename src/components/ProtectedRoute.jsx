import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../layout/Layout";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireStaff = false,
}) => {
  const { isAuthenticated, isAdmin, isStaff, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireStaff && !isStaff()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
