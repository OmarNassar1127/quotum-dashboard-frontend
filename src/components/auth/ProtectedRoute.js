import { Navigate, Outlet } from "react-router-dom";
import PendingActivation from "./PendingActivation";

const ProtectedRoute = ({ isAdmin = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isActive = localStorage.getItem("active") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If it's an admin route but user is not admin
  if (isAdmin && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Show pending activation page if user is not active
  if (!isActive) {
    return <PendingActivation />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
