import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/features/booking/services/appointment.service";
import type { ApiTurno } from "@/types/api";
import {
  getLocalDayRange,
  getLocalWeekRange,
  type DateTimeRange,
} from "@/lib/datetime-utils";

export type AppointmentsRange = DateTimeRange;

export const getAppointmentsQueryKey = (
  businessId: string | number | null,
  range: AppointmentsRange | null,
) => ["appointments", businessId, range?.desde, range?.hasta] as const;

export function getDayRange(date: Date): AppointmentsRange {
  return getLocalDayRange(date);
}

export function getWeekRange(date: Date): AppointmentsRange {
  return getLocalWeekRange(date);
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
