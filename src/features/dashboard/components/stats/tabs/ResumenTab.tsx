import { CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResumenChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface ResumenTabProps {
  statistics: DashboardStatistics;
}

export function ResumenTab({ statistics }: ResumenTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Turnos hoy
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.resumen.turnosHoy.value}
                </p>
                {statistics.resumen.turnosHoy.delta && (
                  <p className="text-xs text-muted-foreground">
                    {statistics.resumen.turnosHoy.delta} vs ayer
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Turnos esta semana
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.resumen.turnosSemana.value}
                </p>
                {statistics.resumen.turnosSemana.delta && (
                  <p className="text-xs text-muted-foreground">
                    {statistics.resumen.turnosSemana.delta} vs semana anterior
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Turnos este mes
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.resumen.turnosMes.value}
                </p>
                {statistics.resumen.turnosMes.delta && (
                  <p className="text-xs text-muted-foreground">
                    {statistics.resumen.turnosMes.delta} vs mes anterior
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResumenChart data={statistics.resumen.turnosPorDia} />
    </div>
  );
}
