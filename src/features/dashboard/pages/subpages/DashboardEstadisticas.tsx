import { useState } from "react";
import { AlertCircle, UsersRound } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStatistics } from "@/hooks/useEstadistica";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { exportStatisticsFile } from "@/lib/statistics-utils";
import type { StatisticsCompare, StatisticsRange, TabValue } from "@/types/statistics";

import { StatsHeader } from "@/features/dashboard/components/stats/StatsHeader";
import { StatsKpiCards } from "@/features/dashboard/components/stats/StatsKpiCards";
import { StatsInsights } from "@/features/dashboard/components/stats/StatsInsights";
import { StatsRangeToggle } from "@/features/dashboard/components/stats/StatsRangeToggle";
import { StatsExportButton } from "@/features/dashboard/components/stats/StatsExportButton";
import { StatsSkeleton } from "@/features/dashboard/components/stats/StatsSkeleton";
import { StatsEmptyState } from "@/features/dashboard/components/stats/StatsEmptyState";

import { ResumenTab } from "@/features/dashboard/components/stats/tabs/ResumenTab";
import { ClientesTab } from "@/features/dashboard/components/stats/tabs/ClientesTab";
import { ServiciosTab } from "@/features/dashboard/components/stats/tabs/ServiciosTab";
import { IngresosTab } from "@/features/dashboard/components/stats/tabs/IngresosTab";
import { AgendaTab } from "@/features/dashboard/components/stats/tabs/AgendaTab";
import { AsistenciaTab } from "@/features/dashboard/components/stats/tabs/AsistenciaTab";
import { EmpleadosTab } from "@/features/dashboard/components/stats/tabs/EmpleadosTab";

const DashboardEstadisticas = () => {
  const [rango, setRango] = useState<StatisticsRange>("mes");
  const [comparar, setComparar] = useState<StatisticsCompare>("anterior");
  const [activeTab, setActiveTab] = useState<TabValue>("resumen");
  const { business, isLoadingBusiness } = useDashboardBusiness();

  const {
    data: statistics,
    isPending,
    isFetching,
    error,
  } = useStatistics(business?.id_negocio, rango, comparar);

  const handleExport = (format: "excel" | "csv") => {
    if (!statistics) {
      toast.error("No hay estadísticas para exportar");
      return;
    }
    exportStatisticsFile(statistics, format);
    toast.success(`Estadísticas exportadas a ${format.toUpperCase()}`);
  };

  const navigateToTab = (tab: TabValue) => setActiveTab(tab);

  if (isLoadingBusiness || isPending) {
    return <StatsSkeleton />;
  }

  if (!business?.id_negocio) {
    return (
      <StatsEmptyState
        icon={UsersRound}
        title="Negocio no encontrado"
        description="No encontramos un negocio vinculado a tu usuario. Registra tu negocio para ver estadísticas."
      />
    );
  }

  if (error || !statistics) {
    return (
      <StatsEmptyState
        icon={AlertCircle}
        title="Error al cargar estadísticas"
        description="No se pudieron cargar las estadísticas del negocio. Intentá nuevamente más tarde."
      />
    );
  }

  return (
    // 1. Agregamos w-full, overflow-x-hidden en móvil (para evitar scroll horizontal accidental) y min-w-0
    <div className="relative flex w-full min-w-0 flex-col space-y-6 overflow-x-hidden sm:overflow-visible">
      {isFetching && !isPending && (
        <div className="absolute left-0 right-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-1/3 animate-[loading-bar_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      )}

      {/* HEADER Y CONTROLES */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <StatsHeader
          businessName={business.nombre}
          rango={rango}
          comparar={comparar}
          isFetching={isFetching && !isPending}
        />

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:flex-wrap">
          <div className="w-full overflow-x-auto sm:w-auto">
            <StatsRangeToggle value={rango} onChange={setRango} />
          </div>
          
          <Select
            value={comparar}
            onValueChange={(v) => setComparar(v as StatisticsCompare)}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Comparar con">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anterior">vs mes anterior</SelectItem>
              <SelectItem value="anio">vs año anterior</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="w-full sm:w-auto">
            <StatsExportButton onExport={handleExport} />
          </div>
        </div>
      </div>

      <StatsKpiCards statistics={statistics} onNavigate={navigateToTab} />
      <StatsInsights statistics={statistics} />

      {/* TABS RESPONSIVE */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full min-w-0">
        {/* 2. Cambiamos a 'flex' (sin inline), aseguramos flex-nowrap y scroll horizontal */}
        <TabsList className="flex h-12 w-full items-center justify-start overflow-x-auto overflow-y-hidden rounded-md p-1 flex-nowrap [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="resumen" className="whitespace-nowrap shrink-0">Resumen</TabsTrigger>
          <TabsTrigger value="clientes" className="whitespace-nowrap shrink-0">Clientes</TabsTrigger>
          <TabsTrigger value="servicios" className="whitespace-nowrap shrink-0">Servicios</TabsTrigger>
          <TabsTrigger value="ingresos" className="whitespace-nowrap shrink-0">Ingresos</TabsTrigger>
          <TabsTrigger value="agenda" className="whitespace-nowrap shrink-0">Agenda</TabsTrigger>
          <TabsTrigger value="asistencia" className="whitespace-nowrap shrink-0">Asistencia</TabsTrigger>
          <TabsTrigger value="empleados" className="whitespace-nowrap shrink-0">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4 mt-4 w-full min-w-0">
          <ResumenTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="clientes" className="space-y-4 mt-4 w-full min-w-0">
          <ClientesTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="servicios" className="space-y-4 mt-4 w-full min-w-0">
          <ServiciosTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="ingresos" className="space-y-4 mt-4 w-full min-w-0">
          <IngresosTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="agenda" className="space-y-4 mt-4 w-full min-w-0">
          <AgendaTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="asistencia" className="space-y-4 mt-4 w-full min-w-0">
          <AsistenciaTab statistics={statistics} />
        </TabsContent>
        <TabsContent value="empleados" className="space-y-4 mt-4 w-full min-w-0">
          <EmpleadosTab statistics={statistics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardEstadisticas;