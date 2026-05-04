import apiClient from "@/lib/api-client";
import type { ApiNegocio } from "@/types/api";

export const negocioService = {
  getAll: async (): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/");
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/negocios/${id}`);
  },

  update: async (id: number, data: Partial<ApiNegocio>): Promise<ApiNegocio> => {
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, data);
  },
};