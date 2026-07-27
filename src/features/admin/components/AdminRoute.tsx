import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, pendingTwoFaEmail } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (!user && pendingTwoFaEmail) return <Navigate to="/verificar-codigo" replace />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};