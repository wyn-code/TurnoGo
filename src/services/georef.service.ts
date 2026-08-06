import apiClient from "@/lib/api-client";
import type { ApiProvincia, ApiLocalidad } from "@/types/api";

export const georefService = {
  getProvincias: async (): Promise<ApiProvincia[]> => {
    return apiClient.get<ApiProvincia[]>("/georef/provincias");
  },

  getLocalidades: async (idProvincia: number): Promise<ApiLocalidad[]> => {
    return apiClient.get<ApiLocalidad[]>("/georef/localidades", {
      id_provincia: idProvincia,
    });
  },
};

export default georefService;
