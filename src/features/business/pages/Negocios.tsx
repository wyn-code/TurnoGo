import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import BusinessGrid from "@/features/marketplace/components/BusinessesGrid";
import { useBusinesses, useCategories } from "@/hooks/useApi";
import { useCategoriesTree } from "@/hooks/queries/useCategoriesTree";
import CategoryFilter from "@/components/CategoryFilter";
import { idsWithDescendants, matchesCategories } from "@/lib/category-tree";

import type { City } from "@/types/api";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const Negocios = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  // ?categoria=<id> (desde la landing) preselecciona esa categoría y su subárbol
  // hasta que el usuario toque el filtro (null = sin tocar).
  const categoriaParam = searchParams.get("categoria");
  const [userCategories, setUserCategories] = useState<number[] | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const selectedLocalidadId = (() => {
    const param = searchParams.get("localidad");
    return param ? Number(param) : null;
  })();
  const locationName = searchParams.get("ciudad");

  const {
    data: businesses = [],
    isLoading: isLoadingBusinesses,
    error: businessesError,
  } = useBusinesses();
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useCategories();
  const { data: categoryTree = [], isLoading: isLoadingTree } = useCategoriesTree();
  const isLoading = isLoadingBusinesses || isLoadingCategories || isLoadingTree;

  const selectedCategories = useMemo(() => {
    if (userCategories) return userCategories;
    if (!categoriaParam) return [];
    const ids = idsWithDescendants(categoryTree, Number(categoriaParam));
    return ids.length ? ids : [Number(categoriaParam)];
  }, [userCategories, categoriaParam, categoryTree]);
  const error = businessesError ? "No se pudieron cargar los negocios" : null;

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

    if (selectedCategories.length > 0) {
      result = result.filter((b) => matchesCategories(b.id_categoria, selectedCategories));
    }

    if (selectedCity) {
      const selectedCityName = cities.find((c) => c.slug === selectedCity)?.name;

      if (selectedCityName) {
        result = result.filter((b) => b.ciudad === selectedCityName);
      }
    }

    if (selectedLocalidadId) {
      const targetName = locationName?.toLowerCase();

      result = result.filter(
        (b) =>
          Number(b.id_localidad) === selectedLocalidadId ||
          (targetName && b.ciudad.toLowerCase() === targetName),
      );
    }

    return result;
  }, [businesses, search, selectedCategories, selectedCity, selectedLocalidadId, locationName, cities]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explorar negocios
          </h1>
          <p className="mt-2 text-muted-foreground">
            Encontrá el negocio ideal y reservá tu turno en segundos.
          </p>
        </div>

        {/* Barra de búsqueda (estilo tarjeta redondeada, en tiempo real) */}
        <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Qué negocio o servicio buscás?"
              className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <Select
            value={selectedCity ?? "all"}
            onValueChange={(value) =>
              setSelectedCity(value === "all" ? null : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger className="w-full border-0 bg-transparent shadow-none focus:ring-0 sm:w-48">
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

        {/* Layout: sidebar de categorías + resultados */}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sidebar de categorías */}
          <aside className="space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Categoría
            </p>
            <CategoryFilter
              tree={categoryTree}
              selectedIds={selectedCategories}
              onChange={setUserCategories}
              disabled={isLoading}
            />
          </aside>

          {/* Resultados */}
          <div>
            {error ? (
              <div className="py-12 text-center">
                <p className="text-lg font-medium text-destructive">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-2xl border bg-card p-4"
                  >
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="mt-2 h-9 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm font-medium text-muted-foreground">
                  {filteredBusinesses.length} negocio
                  {filteredBusinesses.length !== 1 && "s"} encontrado
                  {filteredBusinesses.length !== 1 && "s"}
                </p>
                <BusinessGrid
                  businesses={filteredBusinesses}
                  categories={categories}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Negocios;
