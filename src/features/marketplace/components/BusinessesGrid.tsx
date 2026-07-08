import BusinessCard from "@/features/marketplace/components/BusinessCard";
import type { ApiNegocio, ApiCategory } from "@/types/api";

interface BusinessGridProps {
  businesses: ApiNegocio[];
  categories: ApiCategory[];
}

const BusinessGrid = ({ businesses, categories }: BusinessGridProps) => {
  if (businesses.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No se encontraron negocios con esos filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((biz) => (
        <BusinessCard key={biz.id_negocio} business={biz} categories={categories} />
      ))}
    </div>
  );
};

export default BusinessGrid;