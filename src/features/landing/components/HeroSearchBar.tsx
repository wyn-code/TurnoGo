import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { useCategories } from "@/hooks/useApi";
import { useAllLocalidades } from "@/hooks/queries/useGeorefQuery";
import type { ApiCategory, ApiLocalidad } from "@/types/api";

const HeroSearchBar = () => {
  const navigate = useNavigate();

  const [serviceText, setServiceText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ApiCategory | null>(null);

  const [locationText, setLocationText] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<ApiLocalidad | null>(null);

  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: localidades = [], isLoading: loadingLocalidades } =
    useAllLocalidades();

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id_categoria),
        label: category.nombre,
      })),
    [categories],
  );

  const locationOptions = useMemo(
    () =>
      localidades.map((localidad) => ({
        value: String(localidad.id_localidad),
        label: localidad.nombre,
      })),
    [localidades],
  );

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("categoria", String(selectedCategory.id_categoria));
    } else if (serviceText.trim()) {
      params.set("q", serviceText.trim());
    }

    if (selectedLocation) {
      params.set("localidad", String(selectedLocation.id_localidad));
      params.set("ciudad", selectedLocation.nombre);
    }

    const query = params.toString();
    navigate(query ? `/negocios?${query}` : "/negocios");
  };

  const fieldClassName =
    "h-11 border-0 bg-transparent shadow-none focus-visible:ring-0";

  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      <AutocompleteInput
        value={serviceText}
        onValueChange={(text) => {
          setServiceText(text);
          if (selectedCategory) setSelectedCategory(null);
        }}
        options={categoryOptions}
        onSelect={(option) => {
          const category = categories.find(
            (c) => String(c.id_categoria) === option.value,
          );
          setSelectedCategory(category ?? null);
        }}
        placeholder="¿Qué servicio buscás?"
        icon={<Search size={18} />}
        loading={loadingCategories}
        inputClassName={fieldClassName}
        containerClassName="flex-1"
      />

      <div className="hidden h-8 w-px bg-border sm:block" />

      <AutocompleteInput
        value={locationText}
        onValueChange={(text) => {
          setLocationText(text);
          if (selectedLocation) setSelectedLocation(null);
        }}
        options={locationOptions}
        onSelect={(option) => {
          const localidad = localidades.find(
            (l) => String(l.id_localidad) === option.value,
          );
          setSelectedLocation(localidad ?? null);
        }}
        placeholder="¿En qué ubicación?"
        icon={<MapPin size={18} />}
        loading={loadingLocalidades}
        inputClassName={fieldClassName}
        containerClassName="flex-1"
      />

      <Button
        size="lg"
        className="w-full gap-2 sm:w-auto"
        onClick={handleSearch}
      >
        <Search size={18} />
        Buscar
      </Button>
    </div>
  );
};

export default HeroSearchBar;
