import type { FormData } from "./schema";
import type { CreateCompleteBusinessRequest } from "@/services/business.service";

export const toCreateCompleteBusinessRequest = (
  form: FormData
): CreateCompleteBusinessRequest => {
  return {
    nombre: form.name,
    rubro: form.category,
    wsp: form.whatsapp,
    telefono: form.phone || null,
    direccion: form.address,
    ciudad: form.city,

    // ⚠️ por ahora hardcodeado (después lo mejorás con selects reales)
    id_localidad: 1,
    id_provincia: 1,

    ig_url: form.instagram || null,
    logo: form.image || null,
    activo: true,

    servicios: form.services.map((s) => ({
      nombre_servicio: s.name,
      precio: Number(s.price),
      requiere_aprobacion: false,
      duracion_min: Number(s.duration),
      duracion_max: Number(s.duration),
      activo: true,
    })),

    empleados: form.employees.map((e) => {
      // ⚠️ tu form no tiene apellido ni teléfono → lo generamos
      const parts = e.name.trim().split(" ");

      return {
        nombre: parts[0] || "",
        apellido: parts.slice(1).join(" ") || "SinApellido",

        // ⚠️ temporal → después deberías pedirlo en el form
        telefono: Math.floor(Math.random() * 1000000000).toString(),

        activo: true,
      };
    }),
  };
};