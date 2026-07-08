import { useEffect, useState } from "react";
import { businessService } from "@/services/business.service";
import type { ApiCategory } from "@/types/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80";

const Categories = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await businessService.getCategories();

        if (!Array.isArray(data)) {
          throw new Error("Datos inválidos recibidos");
        }

        setCategories(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar categorías";

        console.error("Error cargando categorías:", errorMessage);

        setError(errorMessage);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && activeCategory === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(categories[0].id_categoria);
    }
  }, [categories, activeCategory]);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Categorías
          </h2>

          <p className="mt-3 text-muted-foreground">
            Explorá por tipo de servicio.
          </p>
        </div>

        {isLoading && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        )}

        {error && (
          <div className="mt-12 text-center">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && categories.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              No hay categorías disponibles
            </p>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <>
            {/* Desktop */}
            <div className="mt-12 hidden h-[420px] gap-3 overflow-hidden rounded-2xl lg:flex">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id_categoria;

                return (
                  <button
                    key={cat.id_categoria}
                    onMouseEnter={() => setActiveCategory(cat.id_categoria)}
                    onFocus={() => setActiveCategory(cat.id_categoria)}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out ${
                      isActive ? "flex-[4]" : "flex-[1]"
                    }`}
                    style={{
                      backgroundImage: `url(${cat.icono || fallbackImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                          : "bg-black/50"
                      }`}
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                      <h3
                        className={`font-bold text-white transition-all duration-500 ${
                          isActive
                            ? "text-3xl"
                            : "text-lg [writing-mode:vertical-rl] rotate-180"
                        }`}
                      >
                        {cat.nombre}
                      </h3>

                      <p
                        className={`mt-2 max-w-md text-white/90 transition-all duration-500 ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none translate-y-4 opacity-0"
                        }`}
                      >
                        {cat.descripcion ??
                          "Encontrá los mejores profesionales cerca tuyo."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile */}
            <div className="mt-12 flex flex-col gap-3 lg:hidden">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id_categoria;

                return (
                  <button
                    key={cat.id_categoria}
                    onClick={() => setActiveCategory(cat.id_categoria)}
                    className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                      isActive ? "h-64" : "h-20"
                    }`}
                    style={{
                      backgroundImage: `url(${cat.icono || fallbackImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50" />

                    <div className="absolute bottom-0 w-full p-5 text-left">
                      <h3 className="text-xl font-bold text-white">
                        {cat.nombre}
                      </h3>

                      {isActive && (
                        <p className="mt-2 text-sm text-white/90">
                          {cat.descripcion ??
                            "Encontrá los mejores profesionales cerca tuyo."}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Categories;
