import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminNavbar } from "@/features/admin/components/AdminNavbar";
import { AdminBusinessesSection } from "@/features/admin/components/AdminBusinessesSection";
import { AdminUsersSection } from "@/features/admin/components/AdminUsersSection";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";

const AdminPanel = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-navbar">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h1 className="text-lg font-bold text-foreground">Panel de Desarrolladores</h1>
                  <p className="text-xs text-muted-foreground">Administración de Turnexo</p>
                </div>
              </div>
              <AdminNavbar />
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="hidden sm:inline text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="negocios" element={<AdminBusinessesSection />} />
          <Route path="usuarios" element={<AdminUsersSection />} />
          <Route index element={<Navigate to="negocios" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
