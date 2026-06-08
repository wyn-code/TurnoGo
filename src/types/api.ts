export interface ApiCategory {
  id_categoria: number;
  nombre: string;
  icono?: string | null;
  slug?: string;
  created_at?: string;
}

export interface ApiNegocio {
  id_negocio: number;
  nombre: string;
  id_categoria: number;
  wsp: string;
  telefono: string | null;
  direccion: string;
  ciudad: string;
  id_localidad: number | null;
  id_provincia: number | null;
  ig_url: string | null;
  logo: string | null;
  activo: boolean;
  creado_at: string;
  usuario_id: number | null;
  slug: string;

  latitud: number | null;
  longitud: number | null;
  
  horarios?: ApiHorario[];
}

export interface ApiServicio {
  id_servicio: number;
  id_negocio: number;
  nombre_servicio: string;
  precio: number;
  requiere_aprobacion: boolean;
  duracion_min: number;
  duracion_max: number;
  activo: boolean;
}

export interface ApiEmpleado {
  id_empleado: number;
  id_negocio: number;
  nombre: string;
  apellido: string;
  telefono: string;
  activo: boolean;
}

export interface ApiTurno {
  id_turno: number;
  id_negocio: number;
  id_cliente: number;
  id_servicio: number;
  id_estado: number;
  id_empleado: number | null;
  fecha_hora_inicio: string;
  fecha_hora_fin: string | null;
  rechazado_motivo?: string | null;
  cliente?: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
  };
  empleado?: {
    nombre?: string;
    apellido?: string;
  } | null;
  servicio?: {
    nombre_servicio?: string;
  };
  estado?: {
    id_estado?: number;
    nombre?: string;
    nombre_estado?: string;
  };
}

export interface ApiHorario {
  id_horarios_negocio?: number;
  id_negocio?: number;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
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


export interface NegocioMapa {
  id_negocio: number;
  nombre: string;
  latitud: number;
  longitud: number;
}
// Aliases de compatibilidad para transición gradual
export type ApiBusiness = ApiNegocio;
export type ApiService = ApiServicio;
export type ApiEmployee = ApiEmpleado;