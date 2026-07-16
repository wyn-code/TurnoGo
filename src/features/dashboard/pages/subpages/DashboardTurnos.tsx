import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Ban, UserX } from "lucide-react";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import {
  useAppointments,
  getDayRange,
  getWeekRange,
} from "@/hooks/queries/useAppointmentsQuery";
import { appointmentService } from "@/features/booking/services/appointment.service";
import { ApiError } from "@/lib/api-client";
import type { ApiTurno } from "@/types/api";

const ESTADO = {
  PENDIENTE: 1,
  CONFIRMADO: 2,
  COMPLETADO: 3,
  CANCELADO: 4,
  NO_ASISTIO: 5,
} as const;

const TRANSICIONES_PERMITIDAS: Record<number, number[]> = {
  [ESTADO.PENDIENTE]: [ESTADO.CONFIRMADO, ESTADO.CANCELADO],
  [ESTADO.CONFIRMADO]: [ESTADO.COMPLETADO, ESTADO.CANCELADO, ESTADO.NO_ASISTIO],
};

const ACCIONES: Record<
  number,
  { label: string; icon: React.ReactNode; variant: "default" | "destructive" | "outline" }
> = {
  [ESTADO.CONFIRMADO]: {
    label: "Confirmar",
    icon: <CheckCircle size={14} />,
    variant: "default",
  },
  [ESTADO.COMPLETADO]: {
    label: "Completar",
    icon: <CheckCircle size={14} />,
    variant: "default",
  },
  [ESTADO.CANCELADO]: {
    label: "Cancelar",
    icon: <Ban size={14} />,
    variant: "destructive",
  },
  [ESTADO.NO_ASISTIO]: {
    label: "No asistió",
    icon: <UserX size={14} />,
    variant: "outline",
  },
};

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
  const queryClient = useQueryClient();

  const [view, setView] = useState<ViewMode>("today");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelTurnoId, setCancelTurnoId] = useState<number | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedId = searchParams.get("turno");
  const highlightedRef = useRef<HTMLDivElement>(null);

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

  const statusMutation = useMutation({
    mutationFn: ({ turnoId, id_estado, rechazado_motivo }: {
      turnoId: number;
      id_estado: number;
      rechazado_motivo?: string;
    }) => appointmentService.changeStatus(turnoId, { id_estado, rechazado_motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof ApiError ? err.detail : "Error al cambiar estado";
      alert(msg);
    },
  });

  const handleCancel = () => {
    if (!cancelTurnoId || !cancelMotivo.trim()) return;
    statusMutation.mutate(
      { turnoId: cancelTurnoId, id_estado: ESTADO.CANCELADO, rechazado_motivo: cancelMotivo.trim() },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setCancelTurnoId(null);
          setCancelMotivo("");
        },
      },
    );
  };

  useEffect(() => {
    if (highlightedId && sortedAppointments.length > 0) {
      const timer = setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightedId, sortedAppointments.length]);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        searchParams.delete("turno");
        setSearchParams(searchParams, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

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
              {sortedAppointments.map((appointment) => {
                const transiciones = TRANSICIONES_PERMITIDAS[appointment.id_estado] ?? [];

                return (
                  <div
                    key={appointment.id_turno}
                    ref={String(appointment.id_turno) === highlightedId ? highlightedRef : undefined}
                    className={`flex flex-wrap items-start justify-between gap-2 rounded-lg border p-4 transition-all ${
                      String(appointment.id_turno) === highlightedId
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border"
                    }`}
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
                      {appointment.rechazado_motivo && (
                        <p className="text-xs text-destructive">
                          Motivo: {appointment.rechazado_motivo}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary">{getStatusLabel(appointment)}</Badge>

                      {transiciones.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {transiciones.map((targetEstado) => {
                            const accion = ACCIONES[targetEstado];
                            if (!accion) return null;

                            if (targetEstado === ESTADO.CANCELADO) {
                              return (
                                <Button
                                  key={targetEstado}
                                  size="sm"
                                  variant={accion.variant}
                                  className="h-7 text-xs gap-1"
                                  disabled={statusMutation.isPending}
                                  onClick={() => {
                                    setCancelTurnoId(appointment.id_turno);
                                    setCancelMotivo("");
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  {accion.icon}
                                  {accion.label}
                                </Button>
                              );
                            }

                            return (
                              <Button
                                key={targetEstado}
                                size="sm"
                                variant={accion.variant}
                                className="h-7 text-xs gap-1"
                                disabled={statusMutation.isPending}
                                onClick={() =>
                                  statusMutation.mutate({
                                    turnoId: appointment.id_turno,
                                    id_estado: targetEstado,
                                  })
                                }
                              >
                                {accion.icon}
                                {accion.label}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar turno</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ingresá el motivo de la cancelación (mínimo 5 caracteres).
            </p>
            <Textarea
              placeholder="Motivo de cancelación..."
              value={cancelMotivo}
              onChange={(e) => setCancelMotivo(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              disabled={cancelMotivo.trim().length < 5 || statusMutation.isPending}
              onClick={handleCancel}
            >
              {statusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cancelar turno"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTurnos;
