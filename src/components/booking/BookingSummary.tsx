import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Briefcase,
  CalendarPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import type { ApiEmpleado, ApiServicio } from "@/types/api";

interface BookingSummaryProps {
  service: ApiServicio;
  professional: ApiEmpleado;
  date: Date;
  time: string;
  client: { firstName: string; lastName: string; email: string; phone: string };
  businessName: string;
  confirmed?: boolean;
}

const generateGoogleCalendarLink = (
  serviceName: string,
  businessName: string,
  date: Date,
  timeSlot: string,
  durationMin: number = 60,
) => {
  // Validar fecha base
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Fecha inválida recibida:", date);
    return "";
  }

  // Validar horario
  if (!timeSlot || !timeSlot.includes(":")) {
    console.error("Horario inválido:", timeSlot);
    return "";
  }

  const [hours, minutes] = timeSlot.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error("Horas/minutos inválidos:", timeSlot);
    return "";
  }

  const startDate = new Date(date);

  startDate.setHours(hours, minutes, 0, 0);

  // Validar startDate
  if (isNaN(startDate.getTime())) {
    console.error("startDate inválida");
    return "";
  }

  const endDate = new Date(startDate.getTime() + durationMin * 60000);

  const formatDateForGoogle = (d: Date) => {
    if (isNaN(d.getTime())) {
      console.error("Fecha inválida al formatear:", d);
      return "";
    }

    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const title = encodeURIComponent(`Turno: ${serviceName} en ${businessName}`);

  const details = encodeURIComponent(`Turno reservado a través de Turnexo.`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${details}`;
};

const BookingSummary = ({
  service,
  professional,
  date,
  time,
  client,
  businessName,
  confirmed,
}: BookingSummaryProps) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    console.error("BookingSummary recibió fecha inválida:", date);

    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-sm text-destructive">
            Error: fecha inválida en la reserva.
          </p>
        </CardContent>
      </Card>
    );
  }
  const professionalName =
    `${professional.nombre} ${professional.apellido}`.trim();

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6 space-y-5">
        {confirmed && (
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle size={48} className="text-primary" />
            <h3 className="text-xl font-bold text-foreground">
              ¡Turno confirmado!
            </h3>

            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <p>
                Te enviamos el comprobante a{" "}
                <span className="font-medium text-foreground">
                  {client.email}
                </span>
              </p>
              <p>
                y un mensaje de WhatsApp al{" "}
                <span className="font-medium text-foreground">
                  {client.phone}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground text-base mb-4">
            {businessName}
          </h4>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase size={16} className="shrink-0 text-primary" />
            <span>
              {service.nombre_servicio} — $
              {Number(service.precio).toLocaleString("es-AR")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} className="shrink-0 text-primary" />
            <span>{professionalName}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} className="shrink-0 text-primary" />
            <span>
              {format(parsedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} className="shrink-0 text-primary" />
            <span>
              {time} hs — {service.duracion_min} min
            </span>
          </div>

          <div className="pt-3 mt-3 border-t border-border text-muted-foreground">
            <span className="font-medium text-foreground">Cliente:</span>{" "}
            {client.firstName} {client.lastName}
          </div>
        </div>

        {confirmed && (
          <div className="space-y-3 pt-2">
            {/* NUEVO: Botón de Añadir a Google Calendar */}
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
              asChild
            >
              <a
                href={generateGoogleCalendarLink(
                  service.nombre_servicio,
                  businessName,
                  parsedDate,
                  time,
                  service.duracion_min,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarPlus size={18} />
                Añadir a Google Calendar
              </a>
            </Button>

            <Button asChild className="w-full shadow-md">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
