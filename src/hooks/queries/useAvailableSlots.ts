import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/features/booking/services/appointment.service";
import type { ApiTurnoConRecurso } from "@/types/api";
import { queryKeys, type QueryEntityId } from "@/lib/query-keys";

/**
 * Turnos de los negocios de una categoría (incluye sus sub-categorías) en una
 * fecha, cada uno con su espacio o empleado (GET /turnos/disponibles).
 *
 * @param categoria - id de categoría padre o hija (null = todas)
 * @param fecha - YYYY-MM-DD (null = cualquier fecha)
 * @param estado - id_estado opcional
 */
export const useAvailableSlots = (
  categoria: QueryEntityId | null,
  fecha: string | null,
  estado: QueryEntityId | null = null,
) =>
  useQuery<ApiTurnoConRecurso[], Error>({
    queryKey: queryKeys.appointments.slots(categoria, fecha, estado),
    queryFn: () =>
      appointmentService.getDisponibles({
        ...(categoria != null && { categoria_padre: categoria }),
        ...(fecha != null && { fecha }),
        ...(estado != null && { estado }),
      }),
    staleTime: 30 * 1000,
  });

export default useAvailableSlots;
