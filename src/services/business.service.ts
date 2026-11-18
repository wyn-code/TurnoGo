import apiClient, { ApiError } from "@/lib/api-client";
import { extractItems, extractTotalPages } from "@/lib/api-response";
import type {
  ApiCategory,
  ApiCategoryTree,
  ApiCategoryTop,
  ApiNegocio,
  NegocioMapa,
} from "@/types/api";

const normalizeCategoryTree = (node: ApiCategoryTree): ApiCategoryTree => ({
  ...node,
  parent_id: node.parent_id ?? null,
  children: Array.isArray(node.children)
    ? node.children.map(normalizeCategoryTree)
    : [],
});

export const obtenerNegociosMapa = async (): Promise<NegocioMapa[]> => {
  const response = await apiClient.get<unknown>("/negocios/mapa");
  return extractItems<NegocioMapa>(response);
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
  imagenes: string[];
  descripcion: string;
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
  /** Espacios del negocio "Deportes"; el backend los crea con este nombre. */
  canchas?: {
    nombre: string;
    activo?: boolean;
  }[];
  /** Cantidad de canchas a autogenerar. No se envía si viene `canchas`. */
  cantidad_espacios?: number;
}

export const businessService = {
  // PÚBLICO: solo activos. El backend responde un envelope paginado; aquí
  // extraemos `items` para mantener el contrato de array que consumen los hooks.
  getAll: async (
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiNegocio[]> => {
    const response = await apiClient.get<unknown>("/negocios/", params);
    return extractItems<ApiNegocio>(response);
  },

  // ADMIN: todos los negocios (activos e inactivos). El backend responde un
  // envelope paginado; se recorren todas las páginas para no perder registros.
  getAllAdmin: async (): Promise<ApiNegocio[]> => {
    const pageSize = 100;
    const firstPage = await apiClient.get<unknown>("/negocios/admin", {
      page: 1,
      page_size: pageSize,
    });
    const negocios = extractItems<ApiNegocio>(firstPage);
    const totalPages = extractTotalPages(firstPage);

    for (let page = 2; page <= totalPages; page += 1) {
      const nextPage = await apiClient.get<unknown>("/negocios/admin", {
        page,
        page_size: pageSize,
      });

      negocios.push(...extractItems<ApiNegocio>(nextPage));
    }

    return negocios;
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

  getMyBusiness: async (usuarioId?: string | number): Promise<ApiNegocio> => {
    try {
      return await apiClient.get<ApiNegocio>("/negocios/me");
    } catch (error) {
      if (
        usuarioId != null &&
        error instanceof ApiError &&
        (error.status === 404 || error.status === 405)
      ) {
        const negocios = await businessService.getAll();
        const mine = negocios.find(
          (n) => String(n.usuario_id) === String(usuarioId),
        );

        if (mine) {
          return mine;
        }
      }

      throw error;
    }
  },

  getBusinessBySlug: async (slug: string): Promise<ApiNegocio> => {
    return apiClient.get<ApiNegocio>(`/negocios/slug/${slug}`);
  },

  createCompleteBusiness: async (
    data: CreateCompleteBusinessRequest,
  ): Promise<CreateBusinessResponse> => {
    return apiClient.post<CreateBusinessResponse>("/negocios/complete", data);
  },

  getCategories: async (): Promise<ApiCategory[]> => {
    const response = await apiClient.get<unknown>("/categorias/");
    return extractItems<ApiCategory>(response);
  },

  getTopCategories: async (limit = 5): Promise<ApiCategoryTop[]> => {
    const response = await apiClient.get<unknown>("/categorias/top", { limit });
    return extractItems<ApiCategoryTop>(response);
  },

  getCategoriesTree: async (): Promise<ApiCategoryTree[]> => {
    const response = await apiClient.get<unknown>("/categorias/tree");
    return extractItems<ApiCategoryTree>(response).map(normalizeCategoryTree);
  },

  buildUpdatePayload: (
    business: ApiNegocio,
    changes: {
      nombre?: string;
      telefono?: string | null;
      wsp?: string;
      ig_url?: string | null;
      direccion?: string;
      ciudad?: string;
      id_localidad?: number | null;
      id_provincia?: number | null;
      logo?: string | null;
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
      id_localidad:
        changes.id_localidad !== undefined
          ? changes.id_localidad
          : business.id_localidad,
      id_provincia:
        changes.id_provincia !== undefined
          ? changes.id_provincia
          : business.id_provincia,
      ig_url: changes.ig_url !== undefined ? changes.ig_url : business.ig_url,
      logo: changes.logo !== undefined ? changes.logo : business.logo,
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
      id_localidad?: number | null;
      id_provincia?: number | null;
      logo?: string | null;
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