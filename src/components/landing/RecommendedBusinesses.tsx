import { useEffect, useState } from "react";
import { useBusinesses } from "@/hooks/useApi";
import { businessService } from "@/services/business.service";
import type { ApiCategory } from "@/types/api";
// IMPORTANTE: Asegurate de importar el Skeleton desde el mismo archivo que tu BusinessCard
import BusinessCard, { BusinessCardSkeleton } from "../marketplace/BusinessCard";

const RecommendedBusinesses = () => {
  const { data: businesses, isLoading: loadingBiz } = useBusinesses({ limit: 10 });
  
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCats(true);
        const data = await businessService.getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Error cargando categorías en recomendados:", err);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    };

    void loadCategories();
  }, []);

  const displayBusinesses = businesses?.slice(0, 9) || [];
  const isLoading = loadingBiz || loadingCats;

  return (
    <section className="bg-secondary/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* El encabezado ahora es persistente, nunca desaparece ni salta */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Negocios recomendados
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descubrí los negocios mejor valorados por la comunidad.
          </p>
        </div>
        
        {/* Grilla dinámica: Skeletons vs Data Real */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Mostramos 3 Skeletons para simular una fila completa cargando
            Array.from({ length: 3 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))
          ) : displayBusinesses.length > 0 ? (
            // Mostramos los negocios reales
            displayBusinesses.map((biz) => (
              <BusinessCard 
                key={biz.id_negocio} 
                business={biz} 
                categories={categories} 
              />
            ))
          ) : (
            // Pequeño fallback por si la API no devuelve nada
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No hay negocios recomendados por el momento.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default RecommendedBusinesses;