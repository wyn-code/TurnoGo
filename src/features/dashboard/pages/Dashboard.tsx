import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { DashboardBusinessProvider } from "@/features/dashboard/contexts/DashboardBusinessContext";
import DashboardResumen from "./subpages/DashboardResumen";
import DashboardTurnos from "./subpages/DashboardTurnos";
import DashboardServicios from "./subpages/DashboardServicios";
import DashboardEmpleados from "./subpages/DashboardEmpleados";
import DashboardHorarios from "./subpages/DashboardHorarios";
import DashboardConfiguracion from "./subpages/DashboardConfiguracion";
import DashboardPersonalizacion from "./subpages/DashboardPersonalizacion";
import DashboardEstadisticas from "./subpages/DashboardEstadisticas";
import { useMyBusiness } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

const sectionTitles: Record<string, string> = {
  "": "Resumen",
  turnos: "Turnos",
  servicios: "Servicios",
  empleados: "Empleados",
  horarios: "Horarios",
  estadisticas: "Estadísticas",
  configuracion: "Configuración",
  personalizacion: "Personalización",
};

const DashboardContent = () => {
  const location = useLocation();
  const path = location.pathname.split("/dashboard/")[1]?.split("/")[0] || "";
  const title = sectionTitles[path] || "Dashboard";

  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title={title} />
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardResumen />} />
            <Route path="turnos" element={<DashboardTurnos />} />
            <Route path="servicios" element={<DashboardServicios />} />
            <Route path="empleados" element={<DashboardEmpleados />} />
            <Route path="horarios" element={<DashboardHorarios />} />
            <Route path="estadisticas" element={<DashboardEstadisticas />} />
            <Route path="configuracion" element={<DashboardConfiguracion />} />
            <Route path="personalizacion" element={<DashboardPersonalizacion />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const {
    data: business,
    isLoading: isLoadingBusiness,
    refetch,
  } = useMyBusiness(user?.id);

  if (authLoading || (user?.id && isLoadingBusiness)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardBusinessProvider
      value={{
        business: business ?? null,
        isLoadingBusiness,
        refreshBusiness: async () => {
          await refetch();
        },
      }}
    >
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </DashboardBusinessProvider>
  );
};

export default Dashboard;
