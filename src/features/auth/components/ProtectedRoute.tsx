import type { ReactNode } from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/features/auth/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    user,
} = useAuth();

  const location = useLocation();

  if (
    user?.role === "duenio" &&
    !user.hasBusiness &&
    location.pathname !== "/registrar-negocio"
) {
    return (
        <Navigate
            to="/registrar-negocio"
            replace
        />
    );
}

  

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
        "
      >
        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-2
            border-primary
            border-t-transparent
          "
        />
      </div>
    );
  }

  if (
    user?.role === "duenio" &&
    user.hasBusiness &&
    location.pathname === "/registrar-negocio"
) {
    return (
        <Navigate
            to="/dashboard"
            replace
        />
    );
}

  // =========================
  // NOT AUTHENTICATED
  // =========================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================
  // AUTHORIZED
  // =========================

  return <>{children}</>;
}