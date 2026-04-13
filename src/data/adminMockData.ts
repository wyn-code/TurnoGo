export interface AdminBusiness {
  id: string;
  businessName: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  slug: string;
  category: string;
  logo?: string;
  primaryColor?: string;
  totalAppointments: number;
  status: "activo" | "inactivo";
  createdAt: string;
}

export const adminBusinesses: AdminBusiness[] = [
  {
    id: "1",
    businessName: "Barbería Don Carlos",
    ownerFirstName: "Carlos",
    ownerLastName: "Rodríguez",
    ownerEmail: "carlos@doncarlos.com",
    slug: "barberia-don-carlos",
    category: "Barbería",
    primaryColor: "#7c3aed",
    totalAppointments: 342,
    status: "activo",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    businessName: "Nails Studio by Ana",
    ownerFirstName: "Ana",
    ownerLastName: "García",
    ownerEmail: "ana@nailsstudio.com",
    slug: "nails-studio-ana",
    category: "Uñas",
    primaryColor: "#ec4899",
    totalAppointments: 189,
    status: "activo",
    createdAt: "2025-02-20",
  },
  {
    id: "3",
    businessName: "Peluquería Moderna",
    ownerFirstName: "Lucía",
    ownerLastName: "Fernández",
    ownerEmail: "lucia@peluqueriamoderna.com",
    slug: "peluqueria-moderna",
    category: "Peluquería",
    primaryColor: "#3b82f6",
    totalAppointments: 521,
    status: "activo",
    createdAt: "2024-11-05",
  },
  {
    id: "4",
    businessName: "Spa Relax Total",
    ownerFirstName: "Martín",
    ownerLastName: "López",
    ownerEmail: "martin@sparelax.com",
    slug: "spa-relax-total",
    category: "Spa",
    primaryColor: "#10b981",
    totalAppointments: 97,
    status: "inactivo",
    createdAt: "2025-03-10",
  },
  {
    id: "5",
    businessName: "Fitness Pro Gym",
    ownerFirstName: "Diego",
    ownerLastName: "Martínez",
    ownerEmail: "diego@fitnesspro.com",
    slug: "fitness-pro-gym",
    category: "Gimnasio",
    primaryColor: "#f59e0b",
    totalAppointments: 264,
    status: "activo",
    createdAt: "2025-01-28",
  },
];

// Admin emails that have access to the dev panel
export const ADMIN_EMAILS = ["admin@turnexo.com", "dev@turnexo.com"];
