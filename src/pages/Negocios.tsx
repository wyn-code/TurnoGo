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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p>Cargando negocios...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p>{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

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

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <Select
            value={selectedCity ?? "all"}
            onValueChange={(value) => setSelectedCity(value === "all" ? null : value)}
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

        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filteredBusinesses.length} negocio
          {filteredBusinesses.length !== 1 && "s"} encontrado
          {filteredBusinesses.length !== 1 && "s"}
        </p>

        <BusinessGrid businesses={filteredBusinesses} categories={categories} />
      </main>

      <Footer />
    </div>
  );
};

export default Negocios;