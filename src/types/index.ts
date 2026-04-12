export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  city: string;
  image?: string;
  phone?: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  active?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  businessId: string;
  requiresApproval?: boolean;
  active?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  businessId: string;
  phone?: string;
  active?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingData {
  serviceId: string;
  professionalId: string;
  date: Date | null;
  timeSlot: string;
  client: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    notes: string;
  };
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  status: "confirmado" | "pendiente" | "cancelado" | "completado";
  notes?: string;
}

export interface DaySchedule {
  open: boolean;
  start: string;
  end: string;
}

export type WeekSchedule = Record<string, DaySchedule>;