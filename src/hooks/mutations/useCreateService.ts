import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { servicioService, type ServicioCreatePayload } from "@/services/servicio.service";
import type { ApiServicio } from "@/types/api";

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServicioCreatePayload) => servicioService.create(data),
    onSuccess: (newService) => {
      const businessKey = String(newService.id_negocio);

      queryClient.setQueriesData<ApiServicio[]>(
        { queryKey: ["services", businessKey] },
        (old) => {
          const list = old ?? [];
          if (list.some((s) => s.id_servicio === newService.id_servicio)) {
            return list;
          }
          return [...list, newService];
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["services", businessKey],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error creando servicio"));
    },
  });
};

export default useCreateService;
