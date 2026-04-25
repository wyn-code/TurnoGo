import type { FormData } from "./schema";

export const STEPS = ["Información", "Imagen", "Contacto", "Ubicación", "Servicios", "Empleados", "Horarios"];

export const defaultValues: FormData = {
  name: "",
  category: 0,
  description: "",
  image: "",
  whatsapp: "",
  phone: "",
  instagram: "",
  website: "",
  address: "",
  city: "",
  locality: "",
  provinceId: 0,

  services: [
    {
      name: "",
      duration: 30,
      price: 0,
      description: "",
    },
  ],

  employees: [
    {
      name: "",
      specialty: "",
    },
  ],

  schedule: {
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
  ["name", "category", "description"],
  ["image"],
  ["whatsapp", "phone", "instagram", "website"],
  ["address", "city", "locality", "provinceId"], // ✅ Usar provinceId
  ["services"],
  ["employees"],
  ["schedule"],
];