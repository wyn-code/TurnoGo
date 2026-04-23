import BusinessCard from "../../components/marketplace/BusinessCard";
import type { ApiBusiness } from "@/types/api";

interface BusinessGridProps {
  businesses: ApiBusiness[];
}

const BusinessGrid = ({ businesses }: BusinessGridProps) => {
  if (businesses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No se encontraron negocios con esos filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((biz) => (
        <BusinessCard key={biz.id_negocio} business={biz} />
      ))}
    </div>
  );
};

export default BusinessGrid;
