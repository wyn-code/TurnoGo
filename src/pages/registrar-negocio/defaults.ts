import type { FormData } from "./schema";

export const STEPS = ["Información", "Imagen", "Contacto", "Ubicación", "Servicios", "Empleados", "Horarios"];

export const defaultValues: FormData = {
  name: "",
  category: 0, // ✅ Número, no string
  description: "",
  image: "",
  whatsapp: "",
  phone: "",
  instagram: "",
  website: "",
  address: "",
  city: "",
  locality: "",
  provinceId: 0, // ✅ Cambiado de 'province' a 'provinceId' y es número
  services: [{ name: "", duration: 30, price: 0, description: "" }],
  employees: [{ name: "", specialty: "" }],
  schedule: {}, 
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