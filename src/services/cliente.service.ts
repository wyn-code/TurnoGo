import apiClient from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";

export interface ClientResponse {
  id_cliente: number;
  telefono: string;
  nombre: string;
  apellido: string;
  created_at: string | null;
}

export interface GetOrCreateClientRequest {
  telefono: string;
  nombre: string;
  apellido: string;
}

export const clientService = {
  getOrCreateClient: async (data: GetOrCreateClientRequest): Promise<ClientResponse> => {
    return apiClient.post<ClientResponse>("/clientes/get-or-create", data);
  },

  createClient: async (data: GetOrCreateClientRequest): Promise<ClientResponse> => {
    return apiClient.post<ClientResponse>("/clientes/", data);
  },

  upsertClient: async (data: GetOrCreateClientRequest): Promise<ClientResponse> => {
    try {
      return await clientService.getOrCreateClient(data);
    } catch (error) {
      // Compatibilidad con backends que no exponen /get-or-create.
      if (error instanceof ApiError && error.status === 404) {
        return clientService.createClient(data);
      }
      throw error;
    }
  },
};