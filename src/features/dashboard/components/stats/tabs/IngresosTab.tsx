import { DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IngresosLineChart } from "@/features/dashboard/components/stats/StatsCharts";
import { formatCurrency } from "@/utils/format";
import type { DashboardStatistics } from "@/types/statistics";

interface IngresosTabProps {
  statistics: DashboardStatistics;
}

export function IngresosTab({ statistics }: IngresosTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Facturación diaria
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(statistics.ingresos.facturacionDiaria.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Facturación semanal
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(statistics.ingresos.facturacionSemanal.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Facturación mensual
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(statistics.ingresos.facturacionMensual.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ticket promedio
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(statistics.ingresos.ticketPromedio.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <IngresosLineChart data={statistics.ingresos.evolucionMensual} />
    </div>
  );
}
