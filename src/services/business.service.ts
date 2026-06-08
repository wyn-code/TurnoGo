import apiClient from "@/lib/api-client";
import type { ApiCategory, ApiNegocio, NegocioMapa } from "@/types/api";


export const obtenerNegociosMapa = async (): Promise<NegocioMapa[]> => {
  return apiClient.get<NegocioMapa[]>("/negocios/mapa");
};

export interface CreateBusinessResponse {
  id_negocio: number;
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
  // PÚBLICO: solo activos
  getAll: async (
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/", params);
  },

  // ADMIN: todos los negocios (activos e inactivos)
  getAllAdmin: async (): Promise<ApiNegocio[]> => {
    return apiClient.get<ApiNegocio[]>("/negocios/admin");
  },

  // Alias para compatibilidad
  getAllBusinesses: async (
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiNegocio[]> => {
    return businessService.getAll(params);
  },

  getBusinessById: async (id: string | number): Promise<ApiNegocio> => {
    return apiClient.get<ApiNegocio>(`/negocios/${id}`);
  },

  getBusinessBySlug: async (slug: string): Promise<ApiNegocio> => {
    return apiClient.get<ApiNegocio>(`/negocios/slug/${slug}`);
  },

  createCompleteBusiness: async (
    data: CreateCompleteBusinessRequest,
  ): Promise<CreateBusinessResponse> => {
    return apiClient.post<CreateBusinessResponse>("/negocios/complete", data);
  },

  getCategories: async (): Promise<ApiCategory[]> =>
    apiClient.get<ApiCategory[]>("/categorias/"),

  buildUpdatePayload: (
    business: ApiNegocio,
    changes: {
      nombre?: string;
      telefono?: string | null;
      wsp?: string;
      ig_url?: string | null;
      direccion?: string;
      ciudad?: string;
    },
  ) => {
    const usuarioId = business.usuario_id;
    if (usuarioId == null) {
      throw new Error("El negocio no tiene usuario_id asociado");
    }

    return {
      nombre: (changes.nombre ?? business.nombre).trim(),
      id_categoria: business.id_categoria,
      wsp: (changes.wsp ?? business.wsp).trim(),
      telefono:
        changes.telefono !== undefined ? changes.telefono : business.telefono,
      direccion: (changes.direccion ?? business.direccion).trim(),
      ciudad: (changes.ciudad ?? business.ciudad).trim(),
      id_localidad: business.id_localidad,
      id_provincia: business.id_provincia,
      ig_url: changes.ig_url !== undefined ? changes.ig_url : business.ig_url,
      logo: business.logo,
      activo: business.activo,
      usuario_id: usuarioId,
    };
  },

  updateBusiness: async (
    id: number,
    business: ApiNegocio,
    changes: {
      nombre?: string;
      telefono?: string | null;
      wsp?: string;
      ig_url?: string | null;
      direccion?: string;
      ciudad?: string;
    },
  ): Promise<ApiNegocio> => {
    const payload = businessService.buildUpdatePayload(business, changes);
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, payload);
  },

  // Eliminación (logical delete - soft delete)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/negocios/${id}`);
  },

  // Actualización genérica (para admin)
  update: async (
    id: number,
    data: Partial<ApiNegocio>,
  ): Promise<ApiNegocio> => {
    return apiClient.put<ApiNegocio>(`/negocios/${id}`, data);
  },
};

export default businessService;