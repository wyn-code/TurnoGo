import { useBusinesses, useCategories } from "@/hooks/useApi";
import BusinessCard from "@/components/marketplace/BusinessCard";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RecommendedBusinesses = () => {
  const { data: businesses, isLoading: loadingBiz } = useBusinesses({
    limit: 10,
  });

  const { data: categories = [], isLoading: loadingCats } = useCategories();

  const displayBusinesses = businesses?.slice(0, 9) || [];
  const isLoading = loadingBiz || loadingCats;

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* El encabezado ahora es persistente, nunca desaparece ni salta */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Encontrá tu próximo turno
          </h2>
          <p className="mt-3 text-muted-foreground">
            Los negocios más elegidos cerca tuyo.
          </p>
        </div>

        {/* Grilla dinámica: Skeletons vs Data Real */}
        <div className=" mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Mostramos 3 Skeletons para simular una fila completa cargando
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="
      min-w-[280px]
      sm:min-w-0
    "
              >
                <Skeleton className="h-[340px] w-full rounded-xl" />
              </div>
            ))
          ) : displayBusinesses.length > 0 ? (
            // Mostramos los negocios reales
            displayBusinesses.map((biz) => (
              <div
                key={biz.id_negocio}
                className="
                min-w-[280px]
                snap-start
                sm:min-w-0
                animate-in
                fade-in
                duration-500
              "
              >
                <BusinessCard business={biz} categories={categories} />
              </div>
            ))
          ) : (
            // Pequeño fallback por si la API no devuelve nada
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">
                No hay negocios recomendados por el momento.
              </p>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link to="/negocios">Ver todos los negocios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedBusinesses;
