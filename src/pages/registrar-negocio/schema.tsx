import { z } from "zod";

export const schema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  category: z.coerce.number().min(1, "Seleccioná una categoría"), 
  description: z.string().min(10, "Descripción demasiado corta"),
  image: z.string().min(1, "La imagen es obligatoria"),
  whatsapp: z.string().min(6, "WhatsApp inválido"),
  phone: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().min(3, "Dirección inválida"),
  city: z.string().min(2, "Ciudad inválida"),
  locality: z.string().optional().nullable(),
  provinceId: z.coerce.number().min(1, "Seleccioná una provincia"), 

  services: z.array(z.object({
    name: z.string().min(2),
    duration: z.number().min(5),
    price: z.number().min(0),
    description: z.string().optional(),
  })).min(1),

  employees: z.array(z.object({
    name: z.string().min(2),
    specialty: z.string().min(2),
  })).min(1),

  schedule: z.record(z.string(), z.object({
    open: z.boolean(),
    start: z.string(),
    end: z.string(),
  })),
});

export type FormData = z.infer<typeof schema>;