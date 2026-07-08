import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { businessService } from "@/services/business.service";
import type { ApiNegocio } from "@/types/api";
import { DashboardBusinessProvider } from "@/features/dashboard/contexts/DashboardBusinessContext";
import DashboardResumen from "./subpages/DashboardResumen";
import DashboardTurnos from "./subpages/DashboardTurnos";
import DashboardServicios from "./subpages/DashboardServicios";
import DashboardEmpleados from "./subpages/DashboardEmpleados";
import DashboardHorarios from "./subpages/DashboardHorarios";
import DashboardConfiguracion from "./subpages/DashboardConfiguracion";
import DashboardPersonalizacion from "./subpages/DashboardPersonalizacion";

const sectionTitles: Record<string, string> = {
  "": "Resumen",
  turnos: "Turnos",
  servicios: "Servicios",
  empleados: "Empleados",
  horarios: "Horarios",
  configuracion: "Configuración",
  personalizacion: "Personalización",
};

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [business, setBusiness] = useState<ApiNegocio | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const loadBusiness = useCallback(async () => {
    if (!user?.id) {
      setBusiness(null);
      setIsLoadingBusiness(false);
      return;
    }

    try {
      setIsLoadingBusiness(true);
      const negocios = await businessService.getAllBusinesses();
      const linkedBusiness =
        negocios.find((n) => String(n.usuario_id) === String(user.id)) ?? null;
      setBusiness(linkedBusiness);
    } catch (error) {
      console.error("Error cargando negocio del usuario:", error);
      setBusiness(null);
    } finally {
      setIsLoadingBusiness(false);
    }
  }, [user?.id]);

  const path = location.pathname.replace(/^\/dashboard\/?/, "");
  const title = sectionTitles[path] || "Dashboard";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBusiness();
  }, [loadBusiness]);

  return (
    <DashboardBusinessProvider
      value={{ business, isLoadingBusiness, refreshBusiness: loadBusiness }}
    >
      <SidebarProvider>
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
                <Route
                  path="configuracion"
                  element={<DashboardConfiguracion />}
                />
                <Route
                  path="personalizacion"
                  element={<DashboardPersonalizacion />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DashboardBusinessProvider>
  );
};

export default Dashboard;
