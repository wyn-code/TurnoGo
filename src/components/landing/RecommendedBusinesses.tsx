import { useEffect, useState } from "react";
import { useBusinesses } from "@/hooks/useApi";
import { businessService } from "@/services/business.service";
import type { ApiCategory } from "@/types/api";
import BusinessCard from "../marketplace/BusinessCard";

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


  if (loadingBiz || loadingCats) {
    return (
      <section className="bg-secondary/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Negocios recomendados
            </h2>
            <p className="mt-3 text-muted-foreground animate-pulse">
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
            <BusinessCard 
              key={biz.id_negocio} 
              business={biz} 
              categories={categories} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedBusinesses;