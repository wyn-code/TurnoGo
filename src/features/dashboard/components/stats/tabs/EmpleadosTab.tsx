import { Users } from "lucide-react";
import { StatsEmptyState } from "@/features/dashboard/components/stats/StatsEmptyState";
import { StatsEmployeeCard } from "@/features/dashboard/components/stats/StatsEmployeeCard";
import { EmpleadosBarChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface EmpleadosTabProps {
  statistics: DashboardStatistics;
}

export function EmpleadosTab({ statistics }: EmpleadosTabProps) {
  if (statistics.empleados.length === 0) {
    return (
      <StatsEmptyState
        icon={Users}
        title="Sin empleados activos"
        description="Los empleados aparecerán cuando tengan turnos registrados en el período seleccionado."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {statistics.empleados.map((employee, index) => (
          <StatsEmployeeCard
            key={employee.nombre}
            employee={employee}
            index={index}
          />
        ))}
      </div>

      <EmpleadosBarChart data={statistics.empleados} />
    </div>
  );
}
