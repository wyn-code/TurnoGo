import { CalendarDays, Users, Briefcase, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { useEffect, useMemo, useState } from "react";
import { businessService } from "@/services/business.service";
import { appointmentService } from "@/services/appointment.service";
import type { ApiTurno } from "@/types/api";
import { Loader2 } from "lucide-react";

const DashboardResumen = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const [servicesCount, setServicesCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState<ApiTurno[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const businessId = business?.id_negocio;

  useEffect(() => {
    const loadSummary = async () => {
      if (!businessId) {
        setServicesCount(0);
        setEmployeesCount(0);
        setSchedulesCount(0);
        setTodayAppointments([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const now = new Date();
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(now);
        dayEnd.setHours(23, 59, 59, 999);

        const [services, employees, schedules, appointments] = await Promise.all([
          businessService.getBusinessServices(String(businessId)),
          businessService.getBusinessProfessionals(String(businessId)),
          businessService.getBusinessSchedules(String(businessId)),
          appointmentService.getAppointmentsByRange({
            id_negocio: businessId,
            desde: dayStart.toISOString(),
            hasta: dayEnd.toISOString(),
          }),
        ]);
        setServicesCount(services.filter((s) => s.activo).length);
        setEmployeesCount(employees.filter((e) => e.activo).length);
        setSchedulesCount(schedules.length);
        setTodayAppointments(appointments);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSummary();
  }, [businessId]);

  const stats = useMemo(
    () => [
      { label: "Turnos hoy", value: todayAppointments.length, icon: CalendarDays, color: "text-primary" },
      { label: "Franja horaria", value: schedulesCount, icon: Clock, color: "text-primary" },
      { label: "Empleados activos", value: employeesCount, icon: Users, color: "text-primary" },
      { label: "Servicios activos", value: servicesCount, icon: Briefcase, color: "text-primary" },
    ],
    [employeesCount, schedulesCount, servicesCount, todayAppointments.length]
  );

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No encontramos un negocio vinculado a tu usuario.</p>
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
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay turnos para hoy.</p>
          ) : (
            <div className="space-y-2">
              {todayAppointments.slice(0, 5).map((appointment) => {
                const start = new Date(appointment.fecha_hora_inicio);
                return (
                  <div
                    key={appointment.id_turno}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-sm text-foreground">Turno #{appointment.id_turno}</span>
                    <span className="text-sm text-muted-foreground">
                      {start.toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardResumen;
