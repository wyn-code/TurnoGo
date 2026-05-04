import apiClient from "@/lib/api-client";

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
};