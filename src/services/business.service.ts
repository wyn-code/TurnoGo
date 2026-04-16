import apiClient from "@/lib/api-client";
import { API_BASE_URL } from "@/lib/api-config";

import type {
  ApiBusiness,
  ApiService,
  ApiEmployee,
  ApiCategory,
} from "@/types/api";

export interface CreateCompleteBusinessRequest {
  nombre: string;
  rubro: string;
  wsp: string;
  telefono?: string | null;
  direccion: string;
  ciudad: string;
  id_localidad?: number | null;
  id_provincia?: number | null;
  ig_url?: string | null;
  logo?: string | null;
  activo: boolean;
  servicios: {
    nombre_servicio: string;
    precio: number;
    requiere_aprobacion: boolean;
    duracion_min: number;
    duracion_max: number;
    activo: boolean;
  }[];
  empleados: {
    nombre: string;
    apellido: string;
    telefono: string;
    activo: boolean;
  }[];
}

export const businessService = {
  getAllBusinesses: async (): Promise<ApiBusiness[]> => {
    return apiClient.get<ApiBusiness[]>("/negocios/");
  },

  getBusinessById: async (id: string | number): Promise<ApiBusiness> => {
    return apiClient.get<ApiBusiness>(`/negocios/${id}`);
  },

  getBusinessBySlug: async (slug: string): Promise<ApiBusiness> => {
    const data = await apiClient.get<ApiBusiness[]>("/negocios/");
    const found = data.find((b) => b.slug === slug);

    if (!found) {
      throw new Error("Negocio no encontrado");
    }

    return found;
  },

  createCompleteBusiness: async (data: CreateCompleteBusinessRequest) => {
    return apiClient.post("/negocios/complete", data);
  },

  getBusinessServices: async (
    businessId: string | number
  ): Promise<ApiService[]> => {
    const data = await apiClient.get<ApiService[]>("/servicios", {
      id_negocio: businessId,
    });

    return data.filter(
      (service) => String(service.id_negocio) === String(businessId)
    );
  },

  getBusinessProfessionals: async (
    businessId: string | number
  ): Promise<ApiEmployee[]> => {
    const data = await apiClient.get<ApiEmployee[]>("/empleados", {
      id_negocio: businessId,
    });

    return data.filter(
      (professional) => String(professional.id_negocio) === String(businessId)
    );
  },

  getCategories: async (): Promise<ApiCategory[]> => {
    return apiClient.getWithBase<ApiCategory[]>(
      API_BASE_URL,
      "/categorias"
    );
  },
};

export default businessService;