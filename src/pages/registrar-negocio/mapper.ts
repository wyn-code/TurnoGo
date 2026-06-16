import type { FormData } from "./schema";
import type { CreateCompleteBusinessRequest } from "@/services/business.service";

export const toCreateCompleteBusinessRequest = (
  form: FormData,
  userId: number
): CreateCompleteBusinessRequest => {
  return {
    nombre: form.nombre,
    id_categoria: Number(form.id_categoria), 
    usuario_id: userId, 
    wsp: form.wsp,
    telefono: form.telefono || null,
    direccion: form.direccion,
    ciudad: form.ciudad,
    id_localidad: form.id_localidad || null,
    id_provincia: Number(form.id_provincia),
    ig_url: form.ig_url || null,
    logo: form.logo || null,
    activo: true,
    descripcion: form.descripcion,
    imagenes: form.imagenes || [],

    servicios: form.servicios.map((s) => ({
      nombre_servicio: s.nombre_servicio,
      precio: Number(s.precio),
      requiere_aprobacion: false,
      duracion_min: Number(s.duracion_min),
      duracion_max: Number(s.duracion_min),
      activo: s.activo ?? true,
    })),

    empleados: form.empleados.map((e) => {
      return {
        nombre: e.nombre,
        apellido: e.apellido,

        // ⚠️ temporal → después deberías pedirlo en el form
        telefono: Math.floor(Math.random() * 1000000000).toString(),

        activo: true,
      };
    }),
  };
};