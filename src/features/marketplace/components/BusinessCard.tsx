import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import type { ApiCategory, ApiNegocio } from "@/types/api";

const categoryDefaults: Record<string, string> = {
  Barberia:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop",
  "Canchas de Padle":
    "https://plus.unsplash.com/premium_photo-1708692920701-19a470ecd667?q=80&w=1170&auto=format&fit=crop",
  "Canchas de Futbol":
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500&auto=format&fit=crop",
  Peluqueria:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500&auto=format&fit=crop",
  "Servicios Tecnicos":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop",
};

interface BusinessCardProps {
  business: ApiNegocio;
  categories: ApiCategory[];
}

const BusinessCard = ({ business, categories }: BusinessCardProps) => {
  const categoryName =
    categories.find(
      (cat) => cat.id_categoria === business.id_categoria
    )?.nombre ?? "Sin Categoría";

  const coverImage =
    categoryDefaults[categoryName] ??
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop";

  return (
    <Link
      to={`/negocio/${business.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Imagen */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={coverImage}
          alt={business.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <CardContent className="p-5">
        {/* Categoría */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
          {categoryName}
        </span>

        {/* Nombre */}
        <h3 className="mt-1 line-clamp-1 text-lg font-bold text-foreground">
          {business.nombre}
        </h3>

        {/* Ciudad */}
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{business.ciudad}</span>
        </div>

        {/* Dirección */}
        <p className="mt-3 min-h-[40px] line-clamp-2 text-sm text-muted-foreground">
          {business.direccion}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Disponibilidad
            </p>
            <p className="font-medium text-foreground">
              Reservá online
            </p>
          </div>

        <span className="rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-violet-700">
          Reservar
        </span>
        </div>
      </CardContent>
    </Link>
  );
};

export default BusinessCard;