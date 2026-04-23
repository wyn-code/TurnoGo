import type { CreateAppointmentRequest } from "@/services/appointment.service";
import type { BookingData } from "@/types/api";

export const toCreateAppointmentRequest = (
  booking: BookingData,
  negocio: { id_negocio: string | number }
): CreateAppointmentRequest => {
  return {
    id_negocio: Number(negocio.id_negocio),
    id_cliente: 1, // ⚠️ reemplazalo por un cliente real existente
    id_servicio: Number(booking.serviceId),
    id_empleado: booking.professionalId
      ? Number(booking.professionalId)
      : null,
    fecha_hora_inicio: `${booking.date?.toISOString().split("T")[0]}T${booking.timeSlot}:00`,
  };
};