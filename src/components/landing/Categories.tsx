import { Scissors, Sparkles, Heart, Hand } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { businessService } from "@/services/business.service";

const iconMap: Record<string, ReactNode> = {
  scissors: <Scissors size={28} />,
  sparkles: <Sparkles size={28} />,
  heart: <Heart size={28} />,
  hand: <Hand size={28} />,
};

interface Category {
  id: string;
  name: string;
  icon: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await businessService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    void loadCategories();
  }, []);

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

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 text-foreground transition-colors hover:border-primary hover:bg-accent"
        >
          <span className="text-primary">
            {iconMap[cat.icon] ?? <Scissors size={28} />}
          </span>
          <span className="font-medium">{cat.name}</span>
        </button>
      ))}
</div>
      </div>
    </section>
  );
};

export default Categories;