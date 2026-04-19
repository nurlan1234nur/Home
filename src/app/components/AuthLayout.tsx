import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
