import apiClient from "@/lib/api-client";
import type { ApiEmpleado } from "@/types/api";

/**
 * Servicio especializado para operaciones de empleados/profesionales
 * Centraliza toda la lógica relacionada con empleados
 */
export const empleadoService = {
  /**
   * Obtener todos los empleados de un negocio
   * @param businessId - ID del negocio
   * @returns Array de empleados
   */
  getByBusiness: async (businessId: string | number): Promise<ApiEmpleado[]> => {
    return apiClient.get<ApiEmpleado[]>(
      `/empleados/?id_negocio=${businessId}`
    );
  },

  /**
   * Obtener un empleado específico
   * @param employeeId - ID del empleado
   * @returns Datos del empleado
   */
  getById: async (employeeId: number): Promise<ApiEmpleado> => {
    return apiClient.get<ApiEmpleado>(
      `/empleados/${employeeId}`
    );
  },

  /**
   * Crear un nuevo empleado
   * @param data - Datos del empleado a crear
   * @returns Empleado creado
   */
  create: async (
    data: Omit<ApiEmpleado, "id_empleado">
  ): Promise<ApiEmpleado> => {
    // Normalizar datos
    const payload = {
      ...data,
      nombre: String(data.nombre).trim(),
      apellido: String(data.apellido).trim(),
      telefono: String(data.telefono).trim(),
      activo: Boolean(data.activo),
      id_negocio: Number(data.id_negocio),
    };

    return apiClient.post<ApiEmpleado>(
      "/empleados/",
      payload
    );
  },

  /**
   * Actualizar un empleado existente
   * @param id - ID del empleado
   * @param data - Datos parciales a actualizar
   * @returns Empleado actualizado
   */
  update: async (
    id: number,
    data: Partial<ApiEmpleado>
  ): Promise<ApiEmpleado> => {
    // Normalizar datos que se actualizan
    const payload: Record<string, any> = {};

    if (data.nombre !== undefined) {
      payload.nombre = String(data.nombre).trim();
    }
    if (data.apellido !== undefined) {
      payload.apellido = String(data.apellido).trim();
    }
    if (data.telefono !== undefined) {
      payload.telefono = String(data.telefono).trim();
    }
    if (data.activo !== undefined) {
      payload.activo = Boolean(data.activo);
    }

    return apiClient.put<ApiEmpleado>(
      `/empleados/${id}`,
      payload
    );
  },

  /**
   * Cambiar estado (activo/inactivo) de un empleado
   * @param id - ID del empleado
   * @param activo - Nuevo estado
   * @returns Empleado actualizado
   */
  toggleStatus: async (
    id: number,
    activo: boolean
  ): Promise<ApiEmpleado> => {
    return apiClient.patch<ApiEmpleado>(
      `/empleados/${id}`,
      { activo }
    );
  },

  /**
   * Eliminar un empleado
   * @param id - ID del empleado
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/empleados/${id}`);
  },
};

export default empleadoService;
