import apiClient from "@/lib/api-client";

import type {
  ApiBusiness,
  ApiService,
  ApiEmployee,
  ApiCategory,
} from "@/types/api";

import type {
  Business,
  Service,
  Professional,
  Category,
} from "@/types";

// 🔹 MAPPERS

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

// 🔥 IMPORTANTE: dejamos SOLO UNA versión (la flexible)
const mapCategoryFromApi = (item: ApiCategory): Category => ({
  id: String((item as any).id_categoria ?? (item as any).id),
  name: (item as any).nombre ?? (item as any).name,
  icon: (item as any).icono ?? (item as any).icon ?? "scissors",
  slug:
    (item as any).slug ??
    ((item as any).nombre ?? (item as any).name)
      .toLowerCase()
      .replace(/\s+/g, "-"),
});

// 🔹 REQUEST TYPE

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

// 🔹 SERVICE

export const businessService = {
  getAllBusinesses: async (): Promise<Business[]> => {
    const data = await apiClient.get<ApiBusiness[]>("/negocios/");
    return data.map(mapBusinessFromApi);
  },

  getBusinessById: async (id: string | number): Promise<Business> => {
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

  getBusinessServices: async (
    businessId: string | number
  ): Promise<Service[]> => {
    const data = await apiClient.get<ApiService[]>("/servicios", {
      id_negocio: businessId,
    });

    return data
      .map(mapServiceFromApi)
      .filter(
        (service) => String(service.businessId) === String(businessId)
      );
  },

  getBusinessProfessionals: async (
    businessId: string | number
  ): Promise<Professional[]> => {
    const data = await apiClient.get<ApiEmployee[]>("/empleados", {
      id_negocio: businessId,
    });

    return data
      .map(mapProfessionalFromApi)
      .filter(
        (professional) =>
          String(professional.businessId) === String(businessId)
      );
  },

  getCategories: async (): Promise<Category[]> => {
    const data = await apiClient.get<ApiCategory[]>("/categorias");

    console.log("RAW API:", data);

    return data.map(mapCategoryFromApi);
  },
};

export default businessService;