import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "./Loader";

export default function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
