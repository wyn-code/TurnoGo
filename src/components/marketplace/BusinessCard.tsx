import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import type { ApiBusiness } from "@/types/api";

// Diccionario de imágenes por defecto (puedes cambiar las URLs por las tuyas)
const categoryDefaults: Record<string, string> = {
  "Barberia": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop",
  "Canchas de Padle": "https://plus.unsplash.com/premium_photo-1708692920701-19a470ecd667?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Canchas de Futbol": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500&auto=format&fit=crop",
  "Peluqueria": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500&auto=format&fit=crop",
  "Servicios Tecnicos": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop",
};

interface BusinessCardProps {
  business: ApiBusiness;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  const categoryName = business.categoria?.nombre ?? "Sin Categoria";
  
  // Selecciona la imagen según categoría o una genérica si no existe en el mapa
  const coverImage = categoryDefaults[categoryName] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop";

  return (
    <Card className="group flex flex-col overflow-hidden border-none bg-card transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1.5">
      {/* Contenedor de Imagen */}
      <div className="h-44 w-full overflow-hidden">
        <img 
          src={coverImage} 
          alt={business.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight text-foreground tracking-tight">
            {business.nombre}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wider font-bold bg-secondary/60">
            {categoryName}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {business.descripcion || "Encontrá el mejor servicio con nosotros."}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
          <MapPin size={14} className="text-primary/70" />
          <span className="truncate">{business.ciudad} — {business.direccion}</span>
        </div>

        <div className="mt-auto flex gap-3 pt-3">
          <Button variant="outline" size="sm" className="flex-1 font-semibold" asChild>
            <Link to={`/negocio/${business.slug}`}>Ver perfil</Link>
          </Button>
          <Button size="sm" className="flex-1 font-semibold shadow-sm active:scale-95 transition-transform" asChild>
            <Link to={`/reservar/${business.slug}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;