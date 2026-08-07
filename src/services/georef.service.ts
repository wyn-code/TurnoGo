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

  getAllLocalidades: async (): Promise<ApiLocalidad[]> => {
    try {
      return await apiClient.get<ApiLocalidad[]>("/georef/localidades");
    } catch {
      const provincias = await georefService.getProvincias();
      const lists = await Promise.all(
        provincias.map((provincia) =>
          apiClient
            .get<ApiLocalidad[]>("/georef/localidades", {
              id_provincia: provincia.id_provincia,
            })
            .catch(() => [] as ApiLocalidad[]),
        ),
      );

      const seen = new Set<number>();

      return lists.flat().filter((localidad) => {
        if (seen.has(localidad.id_localidad)) return false;
        seen.add(localidad.id_localidad);
        return true;
      });
    }
  },
};

export default georefService;
