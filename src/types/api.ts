export interface ApiCategory {
  id_categoria: number;
  nombre: string;
  icono?: string | null;
  slug?: string;
  created_at?: string;
}

export interface ApiBusiness {
  id_negocio: number;
  nombre: string;
  id_categoria: number;
  categoria: ApiCategory | null;
  wsp: string;
  telefono?: string | null;
  direccion: string;
  ciudad: string;
  id_localidad?: number | null;
  id_provincia?: number | null;
  ig_url?: string | null;
  url_fb?: string | null;
  logo?: string | null;
  activo: boolean;
  creado_at?: string;
  slug: string;
  usuario_id?: number | null;
  descripcion?: string;
}

export interface ApiService {
  id_servicio: number;
  id_negocio: number;
  nombre_servicio: string;
  precio: number;
  requiere_aprobacion: boolean;
  duracion_min: number;
  duracion_max: number;
  activo: boolean;
}

export interface ApiEmployee {
  id_empleado: number;
  id_negocio: number;
  nombre: string;
  apellido: string;
  telefono: string;
  activo: boolean;
}

export interface AdminBusiness {
  id: string;
  businessName: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  slug: string;
  category: string;
  logo?: string;
  primaryColor?: string;
  totalAppointments: number;
  status: "activo" | "inactivo";
  createdAt: string;
}

export interface BookingData {
  serviceId: string;
  professionalId: string;
  date: Date | null;
  timeSlot: string;
  client: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    notes: string;
  };
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  status: "confirmado" | "pendiente" | "cancelado" | "completado";
  notes?: string;
}

export interface DaySchedule {
  open: boolean;
  start: string;
  end: string;
}

export type WeekSchedule = Record<string, DaySchedule>;

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}