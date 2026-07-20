import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AgendaChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface AgendaTabProps {
  statistics: DashboardStatistics;
}

export function AgendaTab({ statistics }: AgendaTabProps) {
  return (
    <div className="space-y-4">
      <AgendaChart data={statistics.agenda.horariosDemanda} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Horario pico
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {statistics.agenda.horarioPico}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Día con más turnos
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {statistics.agenda.diaMasTurnos}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Menor ocupación
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {statistics.agenda.menorOcupacion}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Porcentaje de ocupación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Agenda ocupada</span>
            <span className="font-semibold text-foreground">
              {statistics.agenda.ocupacionPorcentaje}%
            </span>
          </div>
          <Progress value={statistics.agenda.ocupacionPorcentaje} className="h-3" />
        </CardContent>
      </Card>
    </div>
  );
}
