import apiClient from "@/lib/api-client";
import type { ApiServicio } from "@/types/api";

const BASE = "/servicios/";

export type ServicioCreatePayload = {
  id_negocio: number;
  nombre_servicio: string;
  precio: number;
  duracion_min: number;
  duracion_max: number;
  requiere_aprobacion: boolean;
  activo: boolean;
};

export type ServicioUpdatePayload = {
  nombre_servicio?: string | null;
  precio?: number | null;
  duracion_min?: number | null;
  duracion_max?: number | null;
  requiere_aprobacion?: boolean | null;
  activo?: boolean | null;
};

export type GetServiciosOptions = {
  /** Por defecto false: el DELETE del backend desactiva (activo=false), no borra el registro. */
  includeInactive?: boolean;
};

export const servicioService = {
  getByBusiness: async (
    businessId: string | number,
    options?: GetServiciosOptions,
  ): Promise<ApiServicio[]> => {
    const data = await apiClient.get<ApiServicio[]>(BASE, {
      id_negocio: businessId,
    });

    const forBusiness = data.filter(
      (service) => String(service.id_negocio) === String(businessId),
    );

    if (options?.includeInactive) {
      return forBusiness;
    }

    return forBusiness.filter((service) => service.activo);
  },

  create: async (data: ServicioCreatePayload): Promise<ApiServicio> => {
    const payload: ServicioCreatePayload = {
      id_negocio: Number(data.id_negocio),
      nombre_servicio: String(data.nombre_servicio).trim(),
      precio: Number(data.precio),
      duracion_min: Number(data.duracion_min),
      duracion_max: Number(data.duracion_max),
      requiere_aprobacion: Boolean(data.requiere_aprobacion),
      activo: Boolean(data.activo),
    };

    return apiClient.post<ApiServicio>(BASE, payload);
  },

  update: async (
    id: number,
    data: ServicioUpdatePayload,
  ): Promise<ApiServicio> => {
    const payload: ServicioUpdatePayload = {};

    if (data.nombre_servicio != null) {
      payload.nombre_servicio = String(data.nombre_servicio).trim();
    }
    if (data.precio != null) {
      payload.precio = Number(data.precio);
    }
    if (data.duracion_min != null) {
      payload.duracion_min = Number(data.duracion_min);
    }
    if (data.duracion_max != null) {
      payload.duracion_max = Number(data.duracion_max);
    }
    if (data.requiere_aprobacion != null) {
      payload.requiere_aprobacion = Boolean(data.requiere_aprobacion);
    }
    if (data.activo != null) {
      payload.activo = Boolean(data.activo);
    }

    return apiClient.put<ApiServicio>(`${BASE}${id}`, payload);
  },

  /** El backend alterna activo/inactivo con PATCH (sin body). */
  toggleStatus: async (id: number): Promise<ApiServicio> => {
    return apiClient.patch<ApiServicio>(`${BASE}${id}`);
  },

  delete: async (id: number): Promise<ApiServicio | void> => {
    const result = await apiClient.delete<ApiServicio | Record<string, never>>(
      `${BASE}${id}`,
    );

    if (result && "id_servicio" in result && result.id_servicio) {
      return result as ApiServicio;
    }

    return undefined;
  },
};

export default servicioService;
