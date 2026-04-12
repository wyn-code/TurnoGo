import apiClient from "@/lib/api-client";
import { API_BASE_URL } from "@/lib/api-config";

import type { Business, Service, Professional, Category } from "@/types";
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

const mapBusinessFromApi = (item: ApiBusiness): Business => ({
  id: String(item.id_negocio),
  name: item.nombre,
  slug: item.slug,
  category: item.rubro,
  address: item.direccion,
  city: item.ciudad,
  image: item.logo || undefined,
  phone: item.telefono || undefined,
  whatsapp: item.wsp,
  instagram: item.ig_url || undefined,
  facebook: item.url_fb || undefined,
  active: item.activo,
  createdAt: item.creado_at || undefined,
});

const mapServiceFromApi = (item: ApiService): Service => ({
  id: String(item.id_servicio),
  name: item.nombre_servicio,
  duration: item.duracion_min,
  price: item.precio,
  businessId: String(item.id_negocio),
  requiresApproval: item.requiere_aprobacion,
  active: item.activo,
});

const mapProfessionalFromApi = (item: ApiEmployee): Professional => ({
  id: String(item.id_empleado),
  name: `${item.nombre} ${item.apellido}`.trim(),
  businessId: String(item.id_negocio),
  phone: item.telefono || undefined,
  active: item.activo,
});

const mapCategoryFromApi = (item: ApiCategory): Category => ({
  id: String(item.id),
  name: item.name,
  icon: item.icon || "briefcase",
  slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
});

export const businessService = {
  getAllBusinesses: async (): Promise<Business[]> => {
    const data = await apiClient.get<ApiBusiness[]>("/negocios/");
    return data.map(mapBusinessFromApi);
  },

  getBusinessById: async (id: string): Promise<Business> => {
    const data = await apiClient.get<ApiBusiness>(`/negocios/${id}`);
    return mapBusinessFromApi(data);
  },

  getBusinessBySlug: async (slug: string): Promise<Business> => {
    const data = await apiClient.get<ApiBusiness[]>("/negocios/");
    const found = data.find((b) => b.slug === slug);

    if (!found) {
      throw new Error("Negocio no encontrado");
    }

    return mapBusinessFromApi(found);
  },

  createCompleteBusiness: async (data: CreateCompleteBusinessRequest) => {
    return apiClient.post("/negocios/complete", data);
  },

  getBusinessServices: async (businessId: string): Promise<Service[]> => {
    const data = await apiClient.get<ApiService[]>(
      `/servicios?business_id=${businessId}`
    );
    return data.map(mapServiceFromApi);
  },

  getBusinessProfessionals: async (
    businessId: string
  ): Promise<Professional[]> => {
    const data = await apiClient.get<ApiEmployee[]>(
      `/empleados?business_id=${businessId}`
    );
    return data.map(mapProfessionalFromApi);
  },

  getCategories: async (): Promise<Category[]> => {
    const data = await apiClient.getWithBase<ApiCategory[]>(
      API_BASE_URL,
      "/categorias"
    );
    return data.map(mapCategoryFromApi);
  },
};

export default businessService;