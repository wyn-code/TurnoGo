import { useMemo } from "react";
import { CalendarDays, Users, Briefcase, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { useEmployees } from "@/hooks/queries/useEmployeesQuery";
import { useHorarios } from "@/hooks/queries/useHorariosQuery";
import {
  useAppointments,
  getDayRange,
} from "@/hooks/queries/useAppointmentsQuery";
import { countOpenDays } from "@/lib/schedule-utils";
import type { ApiTurno } from "@/types/api";

function formatAppointmentTime(appointment: ApiTurno): string {
  const start = new Date(appointment.fecha_hora_inicio);
  return start.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAppointmentLabel(appointment: ApiTurno): string {
  const serviceName = appointment.servicio?.nombre_servicio;
  const clientName = [appointment.cliente?.nombre, appointment.cliente?.apellido]
    .filter(Boolean)
    .join(" ");

  if (serviceName && clientName) {
    return `${serviceName} · ${clientName}`;
  }

  return serviceName || clientName || `Turno #${appointment.id_turno}`;
}

const DashboardResumen = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ?? null;
  const businessIdStr = businessId ? String(businessId) : null;

  const todayRange = useMemo(() => getDayRange(new Date()), []);

  const { data: services = [], isLoading: loadingServices } =
    useServices(businessIdStr);
  const { data: employees = [], isLoading: loadingEmployees } =
    useEmployees(businessIdStr);
  const { data: horarios = [], isLoading: loadingHorarios } =
    useHorarios(businessIdStr);
  const {
    data: todayAppointments = [],
    isLoading: loadingAppointments,
    error: appointmentsError,
  } = useAppointments(businessIdStr, todayRange);

  const isLoading =
    isLoadingBusiness ||
    loadingServices ||
    loadingEmployees ||
    loadingHorarios ||
    loadingAppointments;

  const openDaysCount = countOpenDays(horarios);

  const stats = useMemo(
    () => [
      {
        label: "Turnos hoy",
        value: todayAppointments.length,
        icon: CalendarDays,
        color: "text-primary",
      },
      {
        label: "Días con horario",
        value: openDaysCount,
        icon: Clock,
        color: "text-primary",
      },
      {
        label: "Empleados activos",
        value: employees.filter((e) => e.activo).length,
        icon: Users,
        color: "text-primary",
      },
      {
        label: "Servicios activos",
        value: services.length,
        icon: Briefcase,
        color: "text-primary",
      },
    ],
    [
      employees,
      openDaysCount,
      services.length,
      todayAppointments.length,
    ],
  );

  if (isLoading) {
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
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 font-semibold text-foreground">Turnos de hoy</h3>

          {appointmentsError ? (
            <p className="text-sm text-destructive">
              No se pudieron cargar los turnos de hoy.
            </p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay turnos para hoy.
            </p>
          ) : (
            <div className="space-y-2">
              {todayAppointments
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.fecha_hora_inicio).getTime() -
                    new Date(b.fecha_hora_inicio).getTime(),
                )
                .slice(0, 8)
                .map((appointment) => (
                  <div
                    key={appointment.id_turno}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {getAppointmentLabel(appointment)}
                      </p>
                      {appointment.estado?.nombre ||
                      appointment.estado?.nombre_estado ? (
                        <p className="text-xs text-muted-foreground">
                          {appointment.estado.nombre ??
                            appointment.estado.nombre_estado}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {formatAppointmentTime(appointment)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardResumen;
