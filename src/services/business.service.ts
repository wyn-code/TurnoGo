import apiClient, { ApiError } from "@/lib/api-client";

// Importamos los tipos del backend en español
import type {
  ApiCategory,
  ApiNegocio,
  ApiServicio,
  ApiEmpleado,
  ApiHorario,
} from "@/types/api";

export interface CreateBusinessResponse {
  id_negocio: number;
}

export interface BusinessSchedulePayload {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
}

export interface CreateCompleteBusinessRequest {
  nombre: string;
  wsp: string;
  id_categoria: number;
  usuario_id: number;
  telefono: string | null;
  direccion: string;
  ciudad: string;
  id_localidad: number | null;
  id_provincia: number | null;
  ig_url: string | null;
  logo: string | null;
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
  // ✅ Crear horarios
  createHorarios: async (
    idNegocio: number,
    horarios: BusinessSchedulePayload[]
  ): Promise<void> => {
    try {
      return await apiClient.post(
        `/horarios/${idNegocio}`,
        horarios
      );
    } catch (error) {
      // Backward compatibility for APIs that expect id_negocio in body.
      if (error instanceof ApiError && error.status === 404) {
        return apiClient.post(
          "/horarios",
          {
            id_negocio: idNegocio,
            horarios,
          }
        );
      }

      throw error;
    }
  },

  getBusinessSchedules: async (businessId: string | number): Promise<ApiHorario[]> => {
    const id = String(businessId);

    try {
      return await apiClient.get<ApiHorario[]>(`/horarios/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return apiClient.get<ApiHorario[]>("/horarios", { id_negocio: id });
      }
      throw error;
    }
  },

  // ✅ Crear negocio completo
  createCompleteBusiness: async (
    data: CreateCompleteBusinessRequest
  ): Promise<CreateBusinessResponse> => {
    return apiClient.post<CreateBusinessResponse>(
      "/negocios/complete",
      data
    );
  },

  // 🔹 Negocios
  getAllBusinesses: async (
    params?: Record<string, string | number | boolean>
  ): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>(
      "/negocios/",
      params
    );
  },

  getBusinessById: async (
    id: string | number
  ): Promise<ApiNegocio> => {
    return apiClient.get<ApiNegocio>(
      `/negocios/${id}`
    );
  },

  getBusinessBySlug: async (
    slug: string
  ): Promise<ApiNegocio> => {
    const data = await apiClient.get<ApiNegocio[]>(
      "/negocios/"
    );

    const found = data.find(
      (b) => b.slug === slug
    );

    if (!found) {
      throw new Error("Negocio no encontrado");
    }

    return found;
  },

  // 🔹 Servicios
  getBusinessServices: async (
    businessId: string | number
  ): Promise<ApiServicio[]> => {
    const data = await apiClient.get<ApiServicio[]>(
      "/servicios",
      {
        id_negocio: businessId,
      }
    );

    return data.filter(
      (service) =>
        String(service.id_negocio) ===
        String(businessId)
    );
  },

  // 🔹 Empleados
  getBusinessProfessionals: async (
    businessId: string | number
  ): Promise<ApiEmpleado[]> => {
    return apiClient.get<ApiEmpleado[]>(
      `/empleados/?id_negocio=${businessId}`
    );
  },

  // 🔹 Categorías
  getCategories: async (): Promise<ApiCategory[]> =>
    apiClient.get<ApiCategory[]>("/categorias/"),
};

export default businessService;