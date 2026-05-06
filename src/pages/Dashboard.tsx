import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { negocioService } from "@/services/negocio.service";
import type { ApiNegocio } from "@/types/api";
import { DashboardBusinessProvider } from "@/contexts/DashboardBusinessContext";
import DashboardResumen from "./dashboard/DashboardResumen";
import DashboardTurnos from "./dashboard/DashboardTurnos";
import DashboardServicios from "./dashboard/DashboardServicios";
import DashboardEmpleados from "./dashboard/DashboardEmpleados";
import DashboardHorarios from "./dashboard/DashboardHorarios";
import DashboardConfiguracion from "./dashboard/DashboardConfiguracion";
import DashboardPersonalizacion from "./dashboard/DashboardPersonalizacion";

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
  const [business, setBusiness] = useState<ApiNegocio | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);

  const path = window.location.pathname.split("/dashboard/")[1] || "";
  const title = sectionTitles[path] || "Dashboard";

  useEffect(() => {
    const loadBusiness = async () => {
      if (!user?.id) {
        setBusiness(null);
        setIsLoadingBusiness(false);
        return;
      }

      try {
        setIsLoadingBusiness(true);
        const negocios = await negocioService.getAll();
        const linkedBusiness =
          negocios.find((n) => String(n.usuario_id) === String(user.id)) ?? null;
        setBusiness(linkedBusiness);
      } catch (error) {
        console.error("Error cargando negocio del usuario:", error);
        setBusiness(null);
      } finally {
        setIsLoadingBusiness(false);
      }
    };

    void loadBusiness();
  }, [user?.id]);

  return (
    <DashboardBusinessProvider value={{ business, isLoadingBusiness }}>
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
                <Route path="configuracion" element={<DashboardConfiguracion />} />
                <Route path="personalizacion" element={<DashboardPersonalizacion />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DashboardBusinessProvider>
  );
};

export default Dashboard;
