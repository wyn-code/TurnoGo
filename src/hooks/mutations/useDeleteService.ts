import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { getServicesQueryKey } from "@/hooks/queries/useServicesQuery";
import { servicioService } from "@/services/servicio.service";
import type { ApiServicio } from "@/types/api";

interface DeleteServiceContext {
  previousByKey: Array<{
    key: ReturnType<typeof getServicesQueryKey>;
    data: ApiServicio[] | undefined;
  }>;
}

const snapshotServiceQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  businessId: string | number | null,
) => {
  const keys = [
    getServicesQueryKey(businessId, { includeInactive: false }),
    getServicesQueryKey(businessId, { includeInactive: true }),
  ];

  return keys.map((key) => ({
    key,
    data: queryClient.getQueryData<ApiServicio[]>(key),
  }));
};

const removeFromCaches = (
  queryClient: ReturnType<typeof useQueryClient>,
  businessId: string | number,
  serviceId: number,
) => {
  queryClient.setQueriesData<ApiServicio[]>(
    { queryKey: ["services", String(businessId)] },
    (old) => (old ?? []).filter((s) => s.id_servicio !== serviceId),
  );
};

export const useDeleteService = (businessId: string | number | null) => {
  const queryClient = useQueryClient();

  return useMutation<ApiServicio | void, Error, number, DeleteServiceContext>({
    mutationFn: (serviceId: number) => servicioService.delete(serviceId),

    onMutate: async (serviceId: number) => {
      await queryClient.cancelQueries({ queryKey: ["services", businessId] });

      const previousByKey = snapshotServiceQueries(queryClient, businessId);

      if (businessId != null) {
        removeFromCaches(queryClient, businessId, serviceId);
      }

      return { previousByKey };
    },

    onSuccess: (_result, serviceId) => {
      if (businessId != null) {
        removeFromCaches(queryClient, businessId, serviceId);
      }
    },

    onError: (error, _serviceId, context) => {
      context?.previousByKey.forEach(({ key, data }) => {
        if (data) {
          queryClient.setQueryData(key, data);
        }
      });
      toast.error(getApiErrorMessage(error, "Error eliminando servicio"));
    },
  });
};

export default useDeleteService;
