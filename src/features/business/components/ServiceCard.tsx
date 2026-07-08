import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiServicio } from "@/types/api";

interface ServiceCardProps {
  service: ApiServicio;
  selected?: boolean;
  onSelect?: (service: ApiServicio) => void;
  showBookButton?: boolean;
  onBook?: (service: ApiServicio) => void;
}

const ServiceCard = ({
  service,
  selected,
  onSelect,
  showBookButton = true,
  onBook,
}: ServiceCardProps) => (
  <Card
    className={`cursor-pointer transition-all ${
      selected
        ? "border-primary ring-2 ring-primary/20"
        : "border-border hover:border-primary/40"
    }`}
    onClick={() => onSelect?.(service)}
  >
    <CardContent className="flex items-center justify-between gap-4 p-4">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground">{service.nombre_servicio}</h4>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {service.duracion_min} min
          </span>
          <span className="font-semibold text-foreground">
            ${Number(service.precio).toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {showBookButton && onBook && (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onBook(service);
          }}
        >
          Reservar
        </Button>
      )}
    </CardContent>
  </Card>
);

export default ServiceCard;