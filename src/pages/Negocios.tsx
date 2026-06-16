import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SearchBar from "@/components/marketplace/SearchBar";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import BusinessGrid from "@/components/marketplace/BusinessesGrid";
import { businessService } from "@/services/business.service";

import type { City, ApiNegocio, ApiCategory } from "@/types/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";



const Negocios = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [businesses, setBusinesses] = useState<ApiNegocio[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cities = useMemo<City[]>(() => {
    const uniqueCities = Array.from(
      new Set(
        businesses
          .map((b) => b.ciudad?.trim())
          .filter((city): city is string => Boolean(city))
      )
    );

    return uniqueCities.map((city) => ({
      id: city,
      name: city,
      slug: city.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [businesses]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [businessesData, categoriesData] = await Promise.all([
          businessService.getAllBusinesses(),
          businessService.getCategories().catch(() => []),
        ]);

        setBusinesses(businessesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los negocios");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBusinesses = useMemo(() => {
    let result = [...businesses];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (b) =>
          b.nombre.toLowerCase().includes(q) ||
          b.direccion.toLowerCase().includes(q) ||
          b.ciudad.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (b) => b.id_categoria === selectedCategory
      );
    }

    if (selectedCity) {
      const selectedCityName = cities.find((c) => c.slug === selectedCity)?.name;

      if (selectedCityName) {
        result = result.filter((b) => b.ciudad === selectedCityName);
      }
    }

    return result;
  }, [businesses, search, selectedCategory, selectedCity, cities]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explorar negocios
          </h1>
          <p className="mt-2 text-muted-foreground">
            Encontrá el negocio ideal y reservá tu turno en segundos.
          </p>
        </div>

        {/* Buscador y Filtro de Ciudad */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <Select
            value={selectedCity ?? "all"}
            onValueChange={(value) => setSelectedCity(value === "all" ? null : value)}
            disabled={isLoading} // Deshabilitamos mientras carga
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Categorías */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            // Podrías pasarle un disabled={isLoading} si tu componente lo soporta
          />
        </div>

      {/* --- LÓGICA DE CARGA Y SKELETONS --- */}
      {error ? (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-9 w-full rounded-xl mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            {filteredBusinesses.length} negocio
            {filteredBusinesses.length !== 1 && "s"} encontrado
            {filteredBusinesses.length !== 1 && "s"}
          </p>
          <BusinessGrid businesses={filteredBusinesses} categories={categories} />
        </>
      )}
      </main>

      <Footer />
    </div>
  );
};

export default Negocios;