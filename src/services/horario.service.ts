import apiClient, { ApiError } from "@/lib/api-client";
import type { ApiHorario } from "@/types/api";

export interface BusinessSchedulePayload {
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
}

/**
 * Servicio especializado para operaciones de horarios
 * Centraliza toda la lógica relacionada con horarios de atención
 */
export const horarioService = {
  /**
   * Obtener todos los horarios de un negocio
   * @param businessId - ID del negocio
   * @returns Array de horarios
   */
  getByBusiness: async (
    businessId: string | number
  ): Promise<ApiHorario[]> => {
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

  /**
   * Crear o actualizar horarios de un negocio
   * @param businessId - ID del negocio
   * @param horarios - Array con horarios para cada día
   * @returns Respuesta del servidor (usualmente void)
   */
  createOrUpdate: async (
    businessId: number,
    horarios: BusinessSchedulePayload[],
    hasExisting = false,
  ): Promise<void> => {
    const path = `/horarios/${businessId}`;

    if (hasExisting) {
      return apiClient.put(path, horarios);
    }

    return apiClient.post(path, horarios);
  },

  /**
   * Obtener horario específico de un día
   * @param horarioId - ID del horario
   * @returns Datos del horario
   */
  getById: async (horarioId: number): Promise<ApiHorario> => {
    return apiClient.get<ApiHorario>(
      `/horarios/${horarioId}`
    );
  },

  /**
   * Actualizar un horario específico
   * @param horarioId - ID del horario
   * @param data - Datos a actualizar
   * @returns Horario actualizado
   */
  update: async (
    horarioId: number,
    data: Partial<BusinessSchedulePayload>
  ): Promise<ApiHorario> => {
    return apiClient.put<ApiHorario>(
      `/horarios/${horarioId}`,
      data
    );
  },

  /**
   * Eliminar un horario
   * @param horarioId - ID del horario
   */
  delete: async (horarioId: number): Promise<void> => {
    return apiClient.delete(`/horarios/${horarioId}`);
  },
};

export default horarioService;
