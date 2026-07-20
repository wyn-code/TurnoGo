import { CalendarCheck, UserX, Repeat, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AsistenciaPieChart } from "@/features/dashboard/components/stats/StatsCharts";
import type { DashboardStatistics } from "@/types/statistics";

interface AsistenciaTabProps {
  statistics: DashboardStatistics;
}

export function AsistenciaTab({ statistics }: AsistenciaTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Completados
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.asistencia.completados}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                <CalendarCheck size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Cancelados
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.asistencia.cancelados}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <UserX size={20} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reprogramados
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.asistencia.reprogramados}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                <Repeat size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  No show
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.asistencia.noShow}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950">
                <AlertCircle size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AsistenciaPieChart data={statistics.asistencia.distribucion} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasa de asistencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="py-6 text-center">
              <p className="text-5xl font-bold text-primary">
                {statistics.asistencia.tasaAsistencia}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                de los clientes asistieron · {statistics.asistencia.totalTurnos} turnos
              </p>
            </div>
            <Progress value={statistics.asistencia.tasaAsistencia} className="h-3" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
