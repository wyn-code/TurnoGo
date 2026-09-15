import { CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResumenChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface ResumenTabProps {
  statistics: DashboardStatistics;
}

const getDeltaColor = (deltaStr: string) => {
  if (!deltaStr) return "text-muted-foreground";
  if (deltaStr.includes("+")) return "text-emerald-500 font-medium"; 
  if (deltaStr.includes("-")) return "text-rose-500 font-medium";    
  return "text-muted-foreground";                                   
};

export function ResumenTab({ statistics }: ResumenTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* TARJETA 1: Turnos hoy */}
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
                  <p className="text-xs flex items-center gap-1">
                    {/* 2. Aplicamos la función aquí */}
                    <span className={getDeltaColor(statistics.resumen.turnosHoy.delta)}>
                      {statistics.resumen.turnosHoy.delta}
                    </span>
                    <span className="text-muted-foreground">vs ayer</span>
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TARJETA 2: Turnos esta semana */}
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
                  <p className="text-xs flex items-center gap-1">
                     {/* 2. Aplicamos la función aquí */}
                    <span className={getDeltaColor(statistics.resumen.turnosSemana.delta)}>
                      {statistics.resumen.turnosSemana.delta}
                    </span>
                    <span className="text-muted-foreground">vs semana anterior</span>
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CalendarCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TARJETA 3: Turnos este mes */}
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
                  <p className="text-xs flex items-center gap-1">
                     {/* 2. Aplicamos la función aquí */}
                    <span className={getDeltaColor(statistics.resumen.turnosMes.delta)}>
                      {statistics.resumen.turnosMes.delta}
                    </span>
                    <span className="text-muted-foreground">vs mes anterior</span>
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

      {/* Aquí está el gráfico para el punto 4 */}
      <ResumenChart data={statistics.resumen.turnosPorDia} />
    </div>
  );
}