import apiClient from "@/lib/api-client";
import type {
  ApiPlan,
  ApiSuscripcion,
  ApiNegocioFunciones,
  ApiCrearPreferenciaResponse,
} from "@/types/api";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ??
  import.meta.env.VITE_API_URL ??
  "undefined";

const frontendUrl =
  import.meta.env.VITE_FRONTEND_URL ??
  (typeof window !== "undefined" ? window.location.origin : "undefined");

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
      "[MP DIAG] preference_data (payload enviado al endpoint de creación) =",
      JSON.stringify(preferencePayload, null, 2)
    );
    console.log("[MP DIAG] BACKEND_URL =", backendUrl);
    console.log("[MP DIAG] FRONTEND_URL =", frontendUrl);

    try {
      const response = await apiClient.post<ApiCrearPreferenciaResponse>(
        "/pagos/crear-preferencia",
        preferencePayload
      );

      console.log("[MP DIAG] result completo =", JSON.stringify(response, null, 2));
      console.log(
        "[MP DIAG] collector_id =",
        response.collector_id ?? "undefined"
      );
      console.log(
        "[MP DIAG] preference_id =",
        response.preference_id ?? "undefined"
      );
      console.log("[MP DIAG] init_point =", response.init_point ?? "undefined");
      console.log(
        "[MP DIAG] sandbox_init_point =",
        response.sandbox_init_point ?? "undefined"
      );
      console.log(
        "[MP DIAG] URL recibida por frontend =",
        response.init_point ?? "undefined"
      );
      console.log(
        "[MP DIAG] URL final contiene sandbox =",
        Boolean(response.init_point && response.init_point.includes("sandbox"))
      );

      return response;
    } catch (error) {
      console.error(
        "[MP DIAG] error al crear preferencia =",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
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
