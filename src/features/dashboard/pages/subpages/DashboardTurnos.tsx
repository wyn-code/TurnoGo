import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import {
  useAppointments,
  getDayRange,
  getWeekRange,
} from "@/hooks/queries/useAppointmentsQuery";
import type { ApiTurno } from "@/types/api";

type ViewMode = "today" | "week";

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getClientLabel(appointment: ApiTurno): string {
  const parts = [
    appointment.cliente?.nombre,
    appointment.cliente?.apellido,
  ].filter(Boolean);

  return parts.join(" ") || "Cliente sin nombre";
}

function getStatusLabel(appointment: ApiTurno): string {
  return (
    appointment.estado?.nombre ??
    appointment.estado?.nombre_estado ??
    `Estado #${appointment.id_estado}`
  );
}

const DashboardTurnos = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ?? null;
  const businessIdStr = businessId ? String(businessId) : null;

  const [view, setView] = useState<ViewMode>("today");

  const range = useMemo(
    () => (view === "today" ? getDayRange(new Date()) : getWeekRange(new Date())),
    [view],
  );

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useAppointments(businessIdStr, range);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          new Date(a.fecha_hora_inicio).getTime() -
          new Date(b.fecha_hora_inicio).getTime(),
      ),
    [appointments],
  );

  if (isLoadingBusiness || (businessId && isLoading)) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Gestión de turnos
        </h2>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === "today" ? "default" : "outline"}
            onClick={() => setView("today")}
          >
            Hoy
          </Button>
          <Button
            size="sm"
            variant={view === "week" ? "default" : "outline"}
            onClick={() => setView("week")}
          >
            Esta semana
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          {error ? (
            <p className="text-center text-destructive">
              Error cargando turnos: {error.message}
            </p>
          ) : sortedAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {view === "today"
                ? "No hay turnos para hoy."
                : "No hay turnos esta semana."}
            </p>
          ) : (
            <div className="space-y-3">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id_turno}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-foreground">
                      {appointment.servicio?.nombre_servicio ??
                        `Servicio #${appointment.id_servicio}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getClientLabel(appointment)}
                      {appointment.cliente?.telefono
                        ? ` · ${appointment.cliente.telefono}`
                        : ""}
                    </p>
                    {appointment.empleado ? (
                      <p className="text-sm text-muted-foreground">
                        Profesional:{" "}
                        {[appointment.empleado.nombre, appointment.empleado.apellido]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(appointment.fecha_hora_inicio)}
                    </p>
                  </div>

                  <Badge variant="secondary">{getStatusLabel(appointment)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTurnos;
