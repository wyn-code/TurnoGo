import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/features/booking/services/appointment.service";
import { queryKeys, type QueryEntityId } from "@/lib/query-keys";
import type { ApiTurnoDisponibilidad } from "@/types/api";

export type AppointmentAvailabilityParams = {
  businessId: QueryEntityId;
  desde: string;
  hasta: string;
  employeeId?: QueryEntityId | null;
  /** Filtra por espacio en negocios multi-espacio. */
  espacioId?: QueryEntityId | null;
};

export function useAppointmentAvailability(
  params: AppointmentAvailabilityParams | null,
) {
  return useQuery<ApiTurnoDisponibilidad[], Error>({
    queryKey:
      params == null
        ? ["appointments", "availability", "disabled"]
        : queryKeys.appointments.availability(
            params.businessId,
            params.desde,
            params.hasta,
            params.employeeId,
            params.espacioId,
          ),
    queryFn: () => {
      if (params == null) return [];

      return appointmentService.getDisponibilidad({
        id_negocio: params.businessId,
        desde: params.desde,
        hasta: params.hasta,
        ...(params.employeeId != null && { id_empleado: params.employeeId }),
        ...(params.espacioId != null && { id_espacio: params.espacioId }),
      });
    },
    enabled: params != null,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
}
