import { MapPin } from "lucide-react";
import { StatsEmptyState } from "@/features/dashboard/components/stats/StatsEmptyState";
import { StatsCanchaCard } from "@/features/dashboard/components/stats/StatsCanchaCard";
import { EmpleadosBarChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface CanchasTabProps {
  statistics: DashboardStatistics;
}

/** Métricas por espacio de negocios "Deportes". */
export function CanchasTab({ statistics }: CanchasTabProps) {
  const canchas = statistics.canchas ?? [];

  if (canchas.length === 0) {
    return (
      <StatsEmptyState
        icon={MapPin}
        title="Sin espacios"
        description="Los espacios aparecerán cuando tu negocio tenga canchas y turnos reservados en el período seleccionado."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {canchas.map((cancha, index) => (
          <StatsCanchaCard key={cancha.id_cancha} cancha={cancha} index={index} />
        ))}
      </div>

      <EmpleadosBarChart data={canchas} />
    </div>
  );
}
