import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import type { ApiBusiness } from "@/types/api";

interface BusinessCardProps {
  business: ApiBusiness;
}

const BusinessCard = ({ business }: BusinessCardProps) => (
  <Card className="flex flex-col overflow-hidden border-border bg-card transition-shadow duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
    <div className="h-40 bg-muted" />
    <CardContent className="flex flex-1 flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug text-foreground">{business.nombre}</h3>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {business.categoria?.nombre ?? "Sin categoría"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{business.descripcion}</p>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin size={14} className="shrink-0" />
        <span>{business.ciudad} — {business.direccion}</span>
      </div>
      <div className="mt-auto flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/negocio/${business.slug}`}>Ver perfil</Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/reservar/${business.slug}`}>Reservar turno</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default BusinessCard;
