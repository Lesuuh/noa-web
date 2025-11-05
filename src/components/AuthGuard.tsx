import { Outlet, Navigate } from "react-router-dom";
import Loader from "./Loader";
import { useUser } from "@/contexts/UserContext";

export default function AuthGuard() {
  const { loading, user } = useUser();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
