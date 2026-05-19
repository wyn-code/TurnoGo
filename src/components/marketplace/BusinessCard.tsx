import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton"; // Asegurate de tener este componente de shadcn
import type { ApiCategory, ApiNegocio } from "@/types/api";

const categoryDefaults: Record<string, string> = {
  "Barberia": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop",
  "Canchas de Padle": "https://plus.unsplash.com/premium_photo-1708692920701-19a470ecd667?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Canchas de Futbol": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500&auto=format&fit=crop",
  "Peluqueria": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500&auto=format&fit=crop",
  "Servicios Tecnicos": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop",
};

interface BusinessCardProps {
  business: ApiNegocio;
  categories: ApiCategory[];
}

const BusinessCard = ({ business, categories }: BusinessCardProps) => {
  const categoryName = categories.find(
    cat => cat.id_categoria === business.id_categoria
  )?.nombre ?? "Sin Categoría";

  const coverImage = categoryDefaults[categoryName] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop";

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5">
      
      {/* Contenedor de Imagen */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img 
          src={coverImage} 
          alt={business.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradiente inferior para dar contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Badge posicionado sobre la imagen */}
        <div className="absolute left-3 top-3">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/100 shadow-sm font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5">
            {categoryName}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-foreground">
            {business.nombre}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground min-h-[40px]">
          Encontrá el mejor servicio con nosotros.
        </p>

        <div className="mb-5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground/90">
          <MapPin size={15} className="shrink-0 text-primary" />
          <span className="truncate">{business.ciudad} — {business.direccion}</span>
        </div>

        <div className="mt-auto flex gap-3">
          <Button variant="outline" className="w-full font-semibold rounded-xl" asChild>
            <Link to={`/negocio/${business.slug}`}>Ver perfil</Link>
          </Button>
          <Button className="w-full font-semibold rounded-xl shadow-md transition-transform active:scale-95" asChild>
            <Link to={`/reservar/${business.slug}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- NUEVO: Skeleton para el Loading State ---
export const BusinessCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col p-5">
        <Skeleton className="mb-3 h-6 w-2/3" />
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="mb-5 h-4 w-1/2" />
        <div className="mt-auto flex gap-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;