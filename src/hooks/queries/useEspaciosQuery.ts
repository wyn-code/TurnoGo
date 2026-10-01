import { useQuery } from "@tanstack/react-query";
import { espacioService } from "@/services/espacio.service";
import type { ApiEspacio } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

/**
 * Espacios activos de un negocio, ordenados por número. Cache de 5 minutos.
 * @param idNegocio - ID del negocio (null para deshabilitar)
 */
export const useEspacios = (idNegocio: string | number | null) =>
  useQuery<ApiEspacio[], Error>({
    queryKey:
      idNegocio == null
        ? ["espacios", "disabled"]
        : queryKeys.espacios.byBusiness(idNegocio),
    queryFn: () => espacioService.getByBusiness(idNegocio as string | number),
    enabled: idNegocio != null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export default useEspacios;
