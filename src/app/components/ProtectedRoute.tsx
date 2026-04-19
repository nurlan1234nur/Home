import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
