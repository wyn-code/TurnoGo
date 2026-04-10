// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_VERSION = "v1";

/** Base para `/login`, `/register`, `/me`. El backend Turnexo usa `…/api/auth` (no `/api/v1/auth`). */
export const AUTH_API_ROOT =
  import.meta.env.VITE_AUTH_API_ROOT || `${API_BASE_URL}/api/auth`;

export const API_CONFIG = {
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  endpoints: {
    // Negocios
    businesses: "/businesses",
    businessCreate: "/businesses",
    businessDetail: (slug: string) => `/businesses/${slug}`,
    businessUpdate: (id: string) => `/businesses/${id}`,
    businessDelete: (id: string) => `/businesses/${id}`,
    
    // Servicios
    services: "/services",
    servicesByBusiness: (businessId: string) => `/businesses/${businessId}/services`,
    
    // Empleados
    professionals: "/professionals",
    professionalsByBusiness: (businessId: string) => `/businesses/${businessId}/professionals`,
    
    // Horarios
    schedules: "/schedules",
    schedulesByBusiness: (businessId: string) => `/businesses/${businessId}/schedules`,
    
    // Turnos/Reservas
    appointments: "/appointments",
    appointmentCreate: "/appointments",
    appointmentDetail: (id: string) => `/appointments/${id}`,
    appointmentUpdate: (id: string) => `/appointments/${id}`,
    appointmentCancel: (id: string) => `/appointments/${id}/cancel`,
  },
};

export default API_CONFIG;
