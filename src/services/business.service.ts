import apiClient from "@/lib/api-client";

// Importamos los tipos crudos de la API
import type {
  ApiBusiness,
  ApiService,
  ApiEmployee,
  ApiCategory,
} from "@/types/api";
import type { Category } from "@/types";

const mapCategoryFromApi = (item: ApiCategory): Category => ({
  id: String(item.id_categoria),
  name: item.nombre,
  icon: item.icono ?? "scissors",
  slug:
    item.slug ??
    item.nombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-"),
});
export interface CreateCompleteBusinessRequest {
  nombre: string;
  wsp: string;
  id_categoria: number;
  usuario_id: number;
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
  // 🔹 DEVOLVEMOS DATOS PUROS para Negocios, Servicios y Empleados
  getAllBusinesses: async (
    params?: Record<string, string | number | boolean>
  ): Promise<ApiBusiness[]> => {
    return apiClient.get<ApiBusiness[]>("/negocios/", params);
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
    const data = await apiClient.get<ApiEmployee[]>(
      `/empleados/?id_negocio=${businessId}`
    );
    return data
  },

  // 🔹 EXCEPCIÓN: Usamos el mapper flexible SOLO para Categorías
  getCategories: async (): Promise<Category[]> => {
    const data = await apiClient.get<ApiCategory[]>("/categorias");
    return data.map(mapCategoryFromApi);
  },
};

export default businessService;