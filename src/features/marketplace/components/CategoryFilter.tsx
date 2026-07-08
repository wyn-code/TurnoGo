import { cn } from "@/lib/utils";
import type { ApiCategory } from "@/types/api";

interface CategoryFilterProps {
  categories: ApiCategory[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => (
  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => onSelect(null)}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        selected === null
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary hover:bg-accent"
      )}
    >
      Todos
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id_categoria}
        onClick={() => onSelect(cat.id_categoria === selected ? null : cat.id_categoria)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          selected === cat.id_categoria
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:border-primary hover:bg-accent"
        )}
      >
        {cat.nombre}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
