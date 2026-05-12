import { CheckCircle, Calendar, Clock, User, Briefcase } from "lucide-react";
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
  // Agregamos 'phone' al tipado del cliente
  client: { firstName: string; lastName: string; email: string; phone: string };
  businessName: string;
  confirmed?: boolean;
}

const BookingSummary = ({
  service,
  professional,
  date,
  time,
  client,
  businessName,
  confirmed,
}: BookingSummaryProps) => {
  const professionalName = `${professional.nombre} ${professional.apellido}`.trim();

  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-5">
        {confirmed && (
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle size={48} className="text-primary" />
            <h3 className="text-xl font-bold text-foreground">¡Turno confirmado!</h3>
            
            {/* NUEVO: Mensaje dividido para Email y WhatsApp */}
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <p>
                Te enviamos el comprobante a <span className="font-medium text-foreground">{client.email}</span>
              </p>
              <p>
                y un mensaje de WhatsApp al <span className="font-medium text-foreground">{client.phone}</span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <h4 className="font-semibold text-foreground">{businessName}</h4>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase size={16} className="shrink-0 text-primary" />
            <span>
              {service.nombre_servicio} — ${Number(service.precio).toLocaleString("es-AR")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} className="shrink-0 text-primary" />
            <span>{professionalName}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} className="shrink-0 text-primary" />
            <span>{format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} className="shrink-0 text-primary" />
            <span>
              {time} hs — {service.duracion_min} min
            </span>
          </div>

          <div className="pt-2 border-t border-border text-muted-foreground">
            <span className="font-medium text-foreground">Cliente:</span>{" "}
            {client.firstName} {client.lastName}
          </div>
        </div>

        {confirmed && (
          <Button asChild className="w-full">
            <Link to="/">Volver al inicio</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;