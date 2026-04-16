import apiClient from "@/lib/api-client";

export interface GetOrCreateClientRequest {
  telefono: string;
  nombre: string;
  apellido: string;
}

export interface ClientResponse {
  id_cliente: number;
  telefono: string;
  nombre: string;
  apellido: string;
  created_at?: string | null;
}

export const clientService = {
  getOrCreateClient: async (data: GetOrCreateClientRequest) => {
    return apiClient.post<ClientResponse>("/clientes/get-or-create", data);
  },
};

export default clientService;