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
    pendingTwoFaEmail,
  } = useAuth();

  const location = useLocation();

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

  // =========================
  // PENDING 2FA
  // =========================

  if (!isAuthenticated && pendingTwoFaEmail) {
    return (
      <Navigate
        to="/verificar-codigo"
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
  // ADMIN BYPASS
  // =========================

  if (user?.role === "admin") {
    if (location.pathname.startsWith("/admin")) {
      return <>{children}</>;
    }
    return <Navigate to="/admin" replace />;
  }

  // =========================
  // DUENIO LOGIC
  // =========================

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
  // AUTHORIZED
  // =========================

  return <>{children}</>;
}