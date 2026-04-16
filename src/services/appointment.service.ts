import apiClient from "@/lib/api-client";

export interface CreateAppointmentRequest {
  id_negocio: number;
  id_cliente: number;
  id_servicio: number;
  fecha_hora_inicio: string;
  id_empleado?: number | null;
}

export interface AppointmentResponse {
  id_turno: number;
  id_negocio: number;
  id_cliente: number;
  id_servicio: number;
  id_estado: number;
  id_empleado?: number | null;
  fecha_hora_inicio: string;
  fecha_hora_fin?: string | null;
  id_admin_aprobador?: number | null;
  aprobado_at?: string | null;
  rechazado_motivo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const appointmentService = {
  createAppointment: async (data: CreateAppointmentRequest) => {
    return apiClient.post<AppointmentResponse>("/turnos/", data);
  },

  getAppointmentById: async (id: string | number) => {
    return apiClient.get<AppointmentResponse>(`/turnos/${id}`);
  },

  updateAppointment: async (
    id: string | number,
    data: Partial<CreateAppointmentRequest>
  ) => {
    return apiClient.put<AppointmentResponse>(`/turnos/${id}`, data);
  },

  deleteAppointment: async (id: string | number) => {
    return apiClient.delete<AppointmentResponse>(`/turnos/${id}`);
  },
};

export default appointmentService;