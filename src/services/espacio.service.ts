import apiClient from "@/lib/api-client";
import type { ApiEspacio } from "@/types/api";

type EspacioInput = {
  nombre: string;
  numero?: number | null;
  descripcion?: string | null;
};

/**
 * Espacios reservables de un negocio (antes "canchas").
 *
 * El listado es público porque la página de reserva lo necesita sin sesión;
 * el resto exige token y ownership del negocio.
 */
export const espacioService = {
  /** Espacios de un negocio, ordenados por número. */
  getByBusiness: async (
    businessId: string | number,
    includeInactive = false,
  ): Promise<ApiEspacio[]> =>
    apiClient.get<ApiEspacio[]>(
      `/negocios/${businessId}/espacios`,
      includeInactive ? { incluir_inactivas: true } : undefined,
    ),

  create: async (
    businessId: string | number,
    data: EspacioInput & { activo?: boolean },
  ): Promise<ApiEspacio> =>
    apiClient.post<ApiEspacio>("/espacios", {
      id_negocio: Number(businessId),
      nombre: String(data.nombre).trim(),
      ...(data.numero !== undefined && { numero: data.numero }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
    }),

  update: async (
    id: number,
    data: Partial<EspacioInput & { activo: boolean }>,
  ): Promise<ApiEspacio> => {
    const payload: Record<string, string | number | boolean | null> = {};
    if (data.nombre !== undefined) payload.nombre = String(data.nombre).trim();
    if (data.numero !== undefined) payload.numero = data.numero;
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion;
    if (data.activo !== undefined) payload.activo = Boolean(data.activo);

    return apiClient.put<ApiEspacio>(`/espacios/${id}`, payload);
  },

  toggleStatus: async (id: number, activo: boolean): Promise<ApiEspacio> =>
    apiClient.put<ApiEspacio>(`/espacios/${id}`, { activo }),

  /** Baja lógica en el backend. */
  delete: async (id: number): Promise<void> =>
    apiClient.delete(`/espacios/${id}`),
};

export default espacioService;
