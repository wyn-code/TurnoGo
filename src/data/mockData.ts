import type { Business, Category, City, Service, Professional, TimeSlot } from "../types";

export const recommendedBusinesses: Business[] = [
  {
    id: "1",
    slug: "barberia-don-carlos",
    name: "Barbería Don Carlos",
    category: "Barbería",
    rating: 4.8,
    reviewCount: 124,
    address: "Av. Corrientes 1234",
    city: "CABA",
    description: "Cortes clásicos y modernos con la mejor atención. Más de 15 años de experiencia en barbería tradicional y tendencias actuales.",
    image: "/placeholder.svg",
    phone: "+54 11 4567-8901",
    whatsapp: "+5491145678901",
    instagram: "@barberiadoncarlos",
    facebook: "barberiadoncarlos",
    hours: {
      "Lunes a Viernes": "9:00 - 20:00",
      "Sábados": "9:00 - 18:00",
      "Domingos": "Cerrado",
    },
    paymentMethods: ["Efectivo", "Mercado Pago", "Tarjeta de débito", "Tarjeta de crédito"],
  },
  {
    id: "2",
    slug: "nails-studio-ana",
    name: "Nails Studio by Ana",
    category: "Uñas",
    rating: 4.9,
    reviewCount: 89,
    address: "Calle San Martín 567",
    city: "Rosario",
    description: "Manicura, esculpidas y nail art de alta calidad.",
    image: "/placeholder.svg",
    phone: "+54 341 456-7890",
    whatsapp: "+543414567890",
    hours: { "Lunes a Sábado": "10:00 - 19:00", "Domingos": "Cerrado" },
    paymentMethods: ["Efectivo", "Mercado Pago"],
  },
  {
    id: "3",
    slug: "peluqueria-moderna",
    name: "Peluquería Moderna",
    category: "Peluquería",
    rating: 4.7,
    reviewCount: 203,
    address: "Av. Santa Fe 890",
    city: "CABA",
    description: "Color, corte y tratamientos capilares premium.",
    image: "/placeholder.svg",
    phone: "+54 11 5678-1234",
    hours: { "Lunes a Viernes": "9:00 - 21:00", "Sábados": "9:00 - 17:00" },
    paymentMethods: ["Efectivo", "Mercado Pago", "Tarjeta de crédito"],
  },
  {
    id: "4",
    slug: "centro-estetica-bella",
    name: "Centro Estética Bella",
    category: "Estética",
    rating: 4.6,
    reviewCount: 67,
    address: "Calle Mendoza 321",
    city: "Córdoba",
    description: "Tratamientos faciales y corporales personalizados.",
    image: "/placeholder.svg",
    hours: { "Lunes a Viernes": "10:00 - 20:00" },
    paymentMethods: ["Efectivo", "Mercado Pago"],
  },
  {
    id: "5",
    slug: "masajes-relax",
    name: "Masajes & Relax",
    category: "Masajes",
    rating: 4.9,
    reviewCount: 156,
    address: "Av. Libertador 1500",
    city: "CABA",
    description: "Masajes descontracturantes, relajantes y deportivos.",
    image: "/placeholder.svg",
    hours: { "Lunes a Sábado": "8:00 - 21:00" },
    paymentMethods: ["Efectivo", "Mercado Pago", "Tarjeta de débito"],
  },
  {
    id: "6",
    slug: "style-barber-shop",
    name: "Style Barber Shop",
    category: "Barbería",
    rating: 4.5,
    reviewCount: 98,
    address: "Calle Belgrano 234",
    city: "La Plata",
    description: "Barbería urbana con estilo propio y productos premium.",
    image: "/placeholder.svg",
  },
  {
    id: "7",
    slug: "glamour-peluqueria",
    name: "Glamour Peluquería",
    category: "Peluquería",
    rating: 4.8,
    reviewCount: 175,
    address: "Av. Rivadavia 2100",
    city: "CABA",
    description: "Especialistas en mechas balayage y cortes de tendencia.",
    image: "/placeholder.svg",
  },
  {
    id: "8",
    slug: "spa-zen",
    name: "Spa Zen",
    category: "Masajes",
    rating: 4.7,
    reviewCount: 112,
    address: "Calle Tucumán 456",
    city: "Rosario",
    description: "Circuito spa completo con sauna y masajes orientales.",
    image: "/placeholder.svg",
  },
  {
    id: "9",
    slug: "unas-perfectas",
    name: "Uñas Perfectas",
    category: "Uñas",
    rating: 4.6,
    reviewCount: 54,
    address: "Av. Colón 789",
    city: "Córdoba",
    description: "Semipermanente, kapping y diseños exclusivos.",
    image: "/placeholder.svg",
  },
  {
    id: "10",
    slug: "estetica-integral-laura",
    name: "Estética Integral Laura",
    category: "Estética",
    rating: 4.8,
    reviewCount: 91,
    address: "Calle 7 nro 320",
    city: "La Plata",
    description: "Limpieza facial profunda, radiofrecuencia y más.",
    image: "/placeholder.svg",
  },
];

export const categories: Category[] = [
  { id: "1", name: "Peluquería", icon: "scissors", slug: "peluqueria" },
  { id: "2", name: "Barbería", icon: "scissors", slug: "barberia" },
  { id: "3", name: "Uñas", icon: "sparkles", slug: "unas" },
  { id: "4", name: "Estética", icon: "heart", slug: "estetica" },
  { id: "5", name: "Masajes", icon: "hand", slug: "masajes" },
];

export const cities: City[] = [
  { id: "1", name: "CABA", slug: "caba" },
  { id: "2", name: "Rosario", slug: "rosario" },
  { id: "3", name: "Córdoba", slug: "cordoba" },
  { id: "4", name: "La Plata", slug: "la-plata" },
];

export const services: Service[] = [
  { id: "s1", name: "Corte clásico", duration: 45, price: 5500, businessId: "1" },
  { id: "s2", name: "Corte + barba", duration: 60, price: 7500, businessId: "1" },
  { id: "s3", name: "Barba completa", duration: 30, price: 4000, businessId: "1" },
  { id: "s4", name: "Coloración", duration: 120, price: 12000, businessId: "1" },
  { id: "s5", name: "Corte degradé", duration: 45, price: 6000, businessId: "1" },
  { id: "s6", name: "Manicura semipermanente", duration: 60, price: 8000, businessId: "2" },
  { id: "s7", name: "Esculpidas", duration: 90, price: 12000, businessId: "2" },
  { id: "s8", name: "Nail art", duration: 45, price: 5000, businessId: "2" },
  { id: "s9", name: "Corte mujer", duration: 45, price: 7000, businessId: "3" },
  { id: "s10", name: "Mechas balayage", duration: 180, price: 25000, businessId: "3" },
  { id: "s11", name: "Brushing", duration: 30, price: 4500, businessId: "3" },
  { id: "s12", name: "Limpieza facial", duration: 60, price: 9000, businessId: "4" },
  { id: "s13", name: "Radiofrecuencia", duration: 45, price: 8000, businessId: "4" },
  { id: "s14", name: "Masaje descontracturante", duration: 60, price: 10000, businessId: "5" },
  { id: "s15", name: "Masaje relajante", duration: 50, price: 9000, businessId: "5" },
];

export const professionals: Professional[] = [
  { id: "p1", name: "Carlos Méndez", businessId: "1" },
  { id: "p2", name: "Martín López", businessId: "1" },
  { id: "p3", name: "Diego Ruiz", businessId: "1" },
  { id: "p4", name: "Ana García", businessId: "2" },
];

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = 9; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 19 && m === 30) continue;
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ id: `ts-${time}`, time, available: Math.random() > 0.3 });
    }
  }
  return slots;
};

export const getBusinessBySlug = (slug: string): Business | undefined =>
  recommendedBusinesses.find((b) => b.slug === slug);

export const getServicesByBusinessId = (businessId: string): Service[] =>
  services.filter((s) => s.businessId === businessId);

export const getProfessionalsByBusinessId = (businessId: string): Professional[] =>
  professionals.filter((p) => p.businessId === businessId);