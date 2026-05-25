import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  servicioService,
  type ServicioUpdatePayload,
} from "@/services/servicio.service";
import type { ApiServicio } from "@/types/api";

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ServicioUpdatePayload }) =>
      servicioService.update(id, data),
    onSuccess: (updatedService) => {
      const businessKey = String(updatedService.id_negocio);

      queryClient.setQueriesData<ApiServicio[]>(
        { queryKey: ["services", businessKey] },
        (old) =>
          (old ?? []).map((s) =>
            s.id_servicio === updatedService.id_servicio ? updatedService : s,
          ),
      );

      queryClient.invalidateQueries({
        queryKey: ["services", businessKey],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error actualizando servicio"));
    },
  });
};

export default useUpdateService;
