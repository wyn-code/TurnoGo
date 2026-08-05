import apiClient from "@/lib/api-client";
import type {
  ApiPlan,
  ApiSuscripcion,
  ApiNegocioFunciones,
  ApiCrearPreferenciaResponse,
} from "@/types/api";

export const membershipService = {
  listarPlanes: async (): Promise<ApiPlan[]> => {
    return apiClient.get<ApiPlan[]>("/planes/");
  },

  obtenerFuncionesNegocio: async (
    idNegocio: number
  ): Promise<ApiNegocioFunciones> => {
    return apiClient.get<ApiNegocioFunciones>(
      `/planes/negocios/${idNegocio}/funciones`
    );
  },

  obtenerSuscripcionActual: async (): Promise<ApiSuscripcion | null> => {
    return apiClient.get<ApiSuscripcion | null>(
      "/pagos/suscripcion/actual"
    );
  },

  crearPreferenciaPago: async (
    idPlan: number
  ): Promise<ApiCrearPreferenciaResponse> => {
    return apiClient.post<ApiCrearPreferenciaResponse>(
      "/pagos/crear-preferencia",
      { id_plan: idPlan }
    );
  },

  cancelarSuscripcion: async (
    idSuscripcion: number
  ): Promise<ApiSuscripcion> => {
    return apiClient.post<ApiSuscripcion>(
      `/pagos/suscripcion/${idSuscripcion}/cancelar`
    );
  },

  toggleRenovacionAutomatica: async (
    idSuscripcion: number,
    activa: boolean
  ): Promise<ApiSuscripcion> => {
    return apiClient.put<ApiSuscripcion>(
      `/pagos/suscripcion/${idSuscripcion}/renovacion-automatica`,
      { renovacion_automatica: activa }
    );
  },
};

export default membershipService;
