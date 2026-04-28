import type { FormData } from "./schema";

export const STEPS = ["Información", "Imagen", "Contacto", "Ubicación", "Servicios", "Empleados", "Horarios"];

export const defaultValues: FormData = {
  nombre: "",
  id_categoria: 0,
  descripcion: "",
  logo: "",
  wsp: "",
  telefono: "",
  ig_url: "",
  url_fb: "",
  direccion: "",
  ciudad: "",
  id_localidad: null,
  id_provincia: 0,

  servicios: [
    {
      nombre_servicio: "",
      duracion_min: 30,
      precio: 0,
      activo: true,
    },
  ],

  empleados: [
    {
      nombre: "",
      apellido: "",
    },
  ],

  horarios: {
    Lunes: {
      open: false,
      start: "",
      end: "",
    },
    Martes: {
      open: false,
      start: "",
      end: "",
    },
    Miércoles: {
      open: false,
      start: "",
      end: "",
    },
    Jueves: {
      open: false,
      start: "",
      end: "",
    },
    Viernes: {
      open: false,
      start: "",
      end: "",
    },
    Sábado: {
      open: false,
      start: "",
      end: "",
    },
    Domingo: {
      open: false,
      start: "",
      end: "",
    },
  },
};

export const fieldsPerStep = [
  ["nombre", "id_categoria", "descripcion"],
  ["logo"],
  ["wsp", "telefono", "ig_url", "url_fb"],
  ["direccion", "ciudad", "id_localidad", "id_provincia"],
  ["servicios"],
  ["empleados"],
  ["horarios"],
];