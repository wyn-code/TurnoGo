import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBusinesses } from "@/hooks/useApi";

const RecommendedBusinesses = () => {
  const { data: businesses, isLoading } = useBusinesses({ limit: 10 });

  if (isLoading) {
    return (
      <section className="bg-secondary/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Negocios recomendados
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cargando negocios...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayBusinesses = businesses?.slice(0, 9) || [];

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Negocios recomendados
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descubrí los negocios mejor valorados por la comunidad.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayBusinesses.map((biz) => (
            <Card key={biz.id_negocio} className="overflow-hidden border-border bg-card transition-shadow hover:shadow-md cursor-pointer">
              <div className="h-40 bg-muted" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{biz.nombre}</h3>
                  <Badge variant="secondary" className="text-xs">{biz.categoria?.nombre || "General"}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{biz.ciudad} — {biz.direccion}</p>
                <div className="mt-3 flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-primary text-primary" />
                  <span className="font-medium text-foreground">4.5</span>
                  <span className="text-muted-foreground">(0 reseñas)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBusinesses;
