import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiciosBarChart } from "@/features/dashboard/components/stats/StatsCharts";
import { formatCurrency } from "@/utils/format";
import type { DashboardStatistics } from "@/types/statistics";

interface ServiciosTabProps {
  statistics: DashboardStatistics;
}

export function ServiciosTab({ statistics }: ServiciosTabProps) {
  return (
    <div className="space-y-4">
      <ServiciosBarChart data={statistics.servicios.items} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ingresos y tiempo por servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">Servicio</th>
                  <th className="py-2">Solicitudes</th>
                  <th className="py-2">Ingresos</th>
                  <th className="py-2">Tiempo prom.</th>
                </tr>
              </thead>
              <tbody>
                {statistics.servicios.items.map((service) => (
                  <tr
                    key={service.nombre}
                    className="border-b border-border last:border-0 transition-colors hover:bg-accent/30"
                  >
                    <td className="py-3 font-medium text-foreground">{service.nombre}</td>
                    <td className="py-3">{service.solicitados}</td>
                    <td className="py-3">{formatCurrency(service.ingresos)}</td>
                    <td className="py-3">{service.tiempo} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {statistics.servicios.menosSolicitado && (
            <p className="mt-3 text-xs text-muted-foreground">
              Servicio menos solicitado:{" "}
              <span className="font-medium text-foreground">
                {statistics.servicios.menosSolicitado}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
