import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";
import type { ApiTurno } from "@/types/api";

export type AppointmentsRange = {
  desde: string;
  hasta: string;
};

export const getAppointmentsQueryKey = (
  businessId: string | number | null,
  range: AppointmentsRange | null,
) => ["appointments", businessId, range?.desde, range?.hasta] as const;

export function getDayRange(date: Date): AppointmentsRange {
  const desde = new Date(date);
  desde.setHours(0, 0, 0, 0);

  const hasta = new Date(date);
  hasta.setHours(23, 59, 59, 999);

  return {
    desde: desde.toISOString(),
    hasta: hasta.toISOString(),
  };
}

export function getWeekRange(date: Date): AppointmentsRange {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    desde: start.toISOString(),
    hasta: end.toISOString(),
  };
}

export const useAppointments = (
  businessId: string | number | null,
  range: AppointmentsRange | null,
) => {
  return useQuery<ApiTurno[], Error>({
    queryKey: getAppointmentsQueryKey(businessId, range),
    queryFn: () =>
      appointmentService.getAppointmentsByRange({
        id_negocio: businessId as string | number,
        desde: range!.desde,
        hasta: range!.hasta,
      }),
    enabled: businessId != null && range != null,
    staleTime: 60 * 1000,
  });
};

export default useAppointments;
