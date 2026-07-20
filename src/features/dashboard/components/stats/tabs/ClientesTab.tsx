import { Users, UserCheck, UserX, Repeat, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsEmptyState } from "@/features/dashboard/components/stats/StatsEmptyState";
import type { DashboardStatistics } from "@/types/statistics";

interface ClientesTabProps {
  statistics: DashboardStatistics;
}

export function ClientesTab({ statistics }: ClientesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Clientes nuevos
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.clientes.nuevos.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <UserCheck size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Clientes recurrentes
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.clientes.recurrentes.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Repeat size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Clientes inactivos
                </p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {statistics.clientes.inactivos.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <UserX size={20} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp size={18} className="text-primary" /> Clientes con más visitas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statistics.clientes.topVisitas.length === 0 ? (
              <StatsEmptyState
                icon={Users}
                title="Sin visitas registradas"
                description="Las visitas aparecerán cuando los clientes comiencen a reservar turnos."
              />
            ) : (
              statistics.clientes.topVisitas.map((cliente) => (
                <div
                  key={cliente.nombre}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="font-medium text-foreground">{cliente.nombre}</p>
                  <Badge variant="secondary">{cliente.visitas} visitas</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle size={18} className="text-destructive" /> Más cancelaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statistics.clientes.topCancelaciones.length === 0 ? (
              <StatsEmptyState
                icon={AlertCircle}
                title="Sin cancelaciones"
                description="No hay cancelaciones registradas en el período. ¡Excelente!"
              />
            ) : (
              statistics.clientes.topCancelaciones.map((cliente) => (
                <div
                  key={cliente.nombre}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="font-medium text-foreground">{cliente.nombre}</p>
                  <Badge className="bg-destructive/10 text-destructive" variant="secondary">
                    {cliente.cancelaciones} cancelaciones
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
