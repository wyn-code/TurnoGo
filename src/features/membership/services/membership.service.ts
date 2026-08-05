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
    const preferencePayload = { id_plan: idPlan };
    console.log(
      "[MP DIAG] payload enviado al backend =",
      JSON.stringify(preferencePayload)
    );
    const response = await apiClient.post<ApiCrearPreferenciaResponse>(
      "/pagos/crear-preferencia",
      preferencePayload
    );
    console.log("[MP DIAG] respuesta completa =", JSON.stringify(response));
    console.log("[MP DIAG] collector_id =", response.collector_id ?? "undefined");
    console.log(
      "[MP DIAG] sandbox_init_point =",
      response.sandbox_init_point ?? "undefined"
    );
    return response;
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
