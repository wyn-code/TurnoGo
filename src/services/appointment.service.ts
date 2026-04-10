import apiClient from "@/lib/api-client";
import { API_CONFIG } from "@/lib/api-config";

export interface AppointmentResponse {
  id: string;
  businessId: string;
  serviceId: string;
  professionalId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

// NOTE: mantenemos contrato actual del backend/frontend sin cambios.
// TODO(PR3): separar CreateAppointmentRequest de AppointmentResponse.
export type CreateAppointmentRequest = AppointmentResponse;

export const appointmentService = {
  createAppointment: async (data: CreateAppointmentRequest) => {
    return apiClient.post<AppointmentResponse>(API_CONFIG.endpoints.appointmentCreate, data);
  },

  getAppointmentById: async (id: string) => {
    return apiClient.get<AppointmentResponse>(API_CONFIG.endpoints.appointmentDetail(id));
  },

  getUserAppointments: async (params?: { status?: string; page?: number; limit?: number }) => {
    return apiClient.get<AppointmentResponse[]>(API_CONFIG.endpoints.appointments, params);
  },

  updateAppointment: async (id: string, data: Partial<AppointmentResponse>) => {
    return apiClient.put<AppointmentResponse>(API_CONFIG.endpoints.appointmentUpdate(id), data);
  },

  cancelAppointment: async (id: string, reason?: string) => {
    return apiClient.patch<AppointmentResponse>(API_CONFIG.endpoints.appointmentCancel(id), { reason });
  },
};

export default appointmentService;
