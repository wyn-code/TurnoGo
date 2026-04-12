import { z } from "zod";

export const schema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(1),
  description: z.string().min(10).max(500),
  image: z.string().min(1),
  whatsapp: z.string().min(6),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  address: z.string().min(3),
  city: z.string().min(2),
  locality: z.string().optional(),
  province: z.string().min(2),

  services: z.array(
    z.object({
      name: z.string().min(2),
      duration: z.number().min(5),
      price: z.number().min(0),
      description: z.string().optional(),
    })
  ).min(1),

  employees: z.array(
    z.object({
      name: z.string().min(2),
      specialty: z.string().min(2),
    })
  ).min(1),

  schedule: z.record(
    z.string(),
    z.object({
      open: z.boolean(),
      start: z.string(),
      end: z.string(),
    })
  ),
});

export type FormData = z.infer<typeof schema>;