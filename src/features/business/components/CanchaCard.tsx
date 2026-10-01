import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiCancha } from "@/types/api";

interface CanchaCardProps {
  cancha: ApiCancha;
  selected?: boolean;
  onSelect?: (cancha: ApiCancha) => void;
}

/**
 * Espejo de `ProfessionalCard` para los espacios de negocios "Deportes":
 * mismo look, pero sin avatar ni teléfono.
 */
const CanchaCard = ({ cancha, selected, onSelect }: CanchaCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/40"
      }`}
      onClick={() => onSelect?.(cancha)}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h4 className="font-medium text-foreground">{cancha.nombre}</h4>
          <p className="text-sm text-muted-foreground">
            {cancha.activo ? "Disponible" : "Inactivo"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CanchaCard;
