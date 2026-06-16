import { z } from "zod";

export const schema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  id_categoria: z.coerce.number().min(1, "Seleccioná una categoría"), 
  descripcion: z.string().min(5, "Descripción demasiado corta"),
  wsp: z.string().min(6, "WhatsApp inválido"),
  telefono: z.string().optional().nullable(),
  ig_url: z.string().optional().nullable(),
  url_fb: z.string().optional().nullable(),
  direccion: z.string().min(3, "Dirección inválida"),
  ciudad: z.string().min(2, "Ciudad inválida"),
  id_localidad: z.coerce.number().optional().nullable(),
  id_provincia: z.coerce.number().min(1, "Seleccioná una provincia"), 
  logo: z.string().min(1, "La imagen es obligatoria"),
  imagenes: z.array(z.string().url()).default([]),

  servicios: z.array(z.object({
    nombre_servicio: z.string().min(2),
    duracion_min: z.number().min(5).optional(),
    precio: z.number().min(0).optional(),
    activo: z.boolean().default(true),
  })).min(1),

  empleados: z.array(z.object({
    nombre: z.string().min(2),
    apellido: z.string().min(2),
  })).min(1),

  horarios: z.record(z.string(), z.object({
    open: z.boolean(),
    start: z.string(),
    end: z.string(),
  })),
});

export type FormData = z.infer<typeof schema>;