import type { FormData } from "./schema";

export const DAYS = [
  "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"
];

export const STEPS = [
  "Información","Imagen","Contacto","Ubicación","Servicios","Empleados","Horarios"
];

export const defaultSchedule = Object.fromEntries(
  DAYS.map((d) => [d, { open: d !== "Domingo", start: "09:00", end: "18:00" }])
);

export const defaultValues: FormData = {
  name: "",
  category: "",
  description: "",
  image: "",
  whatsapp: "",
  phone: "",
  instagram: "",
  website: "",
  address: "",
  city: "",
  locality: "",
  province: "",
  services: [{ name: "", duration: 30, price: 0, description: "" }],
  employees: [{ name: "", specialty: "" }],
  schedule: defaultSchedule,
};

export const fieldsPerStep = [
  ["name", "category", "description"],
  ["image"],
  ["whatsapp", "phone", "instagram", "website"],
  ["address", "city", "locality", "province"],
  ["services"],
  ["employees"],
  ["schedule"],
];