import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessService, type CreateBusinessRequest } from "@/services/business.service";

// Hook para crear un negocio
export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessRequest) => businessService.createBusiness(data),
    onSuccess: (data) => {
      // Invalidar lista de negocios para refrescar
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      // Guardar el negocio creado en cache
      queryClient.setQueryData(["business", data.slug], data);
    },
    onError: (error: Error) => {
      console.error("Error creating business:", error);
    },
  });
};

// Hook para obtener todos los negocios
export const useBusinesses = (params?: { category?: string; city?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["businesses", params],
    queryFn: () => businessService.getAllBusinesses(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un negocio por slug
export const useBusinessBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["business", slug],
    queryFn: () => businessService.getBusinessBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!slug,
  });
};

// Hook para actualizar un negocio
export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBusinessRequest> }) =>
      businessService.updateBusiness(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.setQueryData(["business", data.slug], data);
    },
  });
};

// Hook para eliminar un negocio
export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => businessService.deleteBusiness(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};

// Hook para obtener servicios de un negocio
export const useBusinessServices = (businessId: string) => {
  return useQuery({
    queryKey: ["services", businessId],
    queryFn: () => businessService.getBusinessServices(businessId),
    enabled: !!businessId,
  });
};

// Hook para obtener profesionales de un negocio
export const useBusinessProfessionals = (businessId: string) => {
  return useQuery({
    queryKey: ["professionals", businessId],
    queryFn: () => businessService.getBusinessProfessionals(businessId),
    enabled: !!businessId,
  });
};

// Hook para obtener horarios de un negocio
export const useBusinessSchedule = (businessId: string) => {
  return useQuery({
    queryKey: ["schedule", businessId],
    queryFn: () => businessService.getBusinessSchedule(businessId),
    enabled: !!businessId,
  });
};
