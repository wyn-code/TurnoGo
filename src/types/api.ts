export interface ApiBusiness {
  id_negocio: number;
  nombre: string;
  rubro: string;
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

export interface ApiCategory {
  id: number;
  name: string;
  icon?: string;
  slug?: string;
}