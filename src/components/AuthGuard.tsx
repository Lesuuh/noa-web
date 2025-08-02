// src/components/AuthGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AuthGuard;
