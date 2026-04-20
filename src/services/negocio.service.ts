import apiClient from "@/lib/api-client";

export interface Negocio {
  id: number;
  nombre: string;
  categoria?: string;
  slug?: string;
}

export const negocioService = {
  getAll: async () => {
    return apiClient.get<Negocio[]>("/negocios/");
  },

  delete: async (id: number) => {
    return apiClient.delete(`/negocios/${id}`);
  },

  update: async (id: number, data: Partial<Negocio>) => {
    return apiClient.put(`/negocios/${id}`, data);
  },
};