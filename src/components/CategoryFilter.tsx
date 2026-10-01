import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSelectedDescendant } from "@/lib/category-tree";
import type { ApiCategoryTree } from "@/types/api";

interface CategoryFilterProps {
  /** Árbol de GET /categorias/tree. */
  tree: ApiCategoryTree[];
  /** Categoría elegida. Es selección única; la lista sólo tiene varios ids si
   *  viene de afuera (p. ej. ?categoria=<padre>, que incluye a todos sus hijos). */
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
  className?: string;
}

const itemClass = (active: boolean) =>
  cn(
    "w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors",
    active
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "text-foreground hover:bg-accent",
  );

/**
 * Filtro de categorías tipo acordeón.
 * - Sin hijos: ítem simple que filtra directo por esa categoría.
 * - Con hijos: encabezado que sólo expande/colapsa (no filtra); los hijos se
 *   muestran indentados, con el mismo estilo que un ítem simple, y filtran por
 *   su propio id. Elegir un ítem desmarca el anterior.
 */
const CategoryFilter = ({
  tree,
  selectedIds,
  onChange,
  disabled,
  className,
}: CategoryFilterProps) => {
  const selected = new Set(selectedIds);
  // Overrides del usuario; sin override, un padre con hijos elegidos se muestra
  // abierto (p. ej. selección que viene de ?categoria= en la URL).
  const [overrides, setOverrides] = useState<Map<number, boolean>>(new Map());

  const isOpen = (node: ApiCategoryTree) =>
    overrides.get(node.id_categoria) ?? hasSelectedDescendant(node, selected);

  return (
    <nav aria-label="Filtro de categorías" className={cn("space-y-1", className)}>
      <button
        type="button"
        onClick={() => onChange([])}
        disabled={disabled}
        className={itemClass(selectedIds.length === 0)}
      >
        Todas
      </button>

      {tree.map((node) => {
        if (node.children.length === 0) {
          return (
            <button
              key={node.id_categoria}
              type="button"
              disabled={disabled}
              aria-pressed={selected.has(node.id_categoria)}
              onClick={() => onChange([node.id_categoria])}
              className={itemClass(selected.has(node.id_categoria))}
            >
              {node.nombre}
            </button>
          );
        }

        const open = isOpen(node);
        const hasActiveChild = hasSelectedDescendant(node, selected);

        return (
          <div key={node.id_categoria}>
            <button
              type="button"
              disabled={disabled}
              aria-expanded={open}
              onClick={() =>
                setOverrides((prev) => new Map(prev).set(node.id_categoria, !open))
              }
              className={cn(
                itemClass(false),
                "flex items-center gap-2",
                hasActiveChild && "text-primary",
              )}
            >
              <ChevronRight
                className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-90")}
              />
              {node.nombre}
            </button>

            {open && (
              <div className="mt-1 space-y-1">
                {node.children.map((child) => (
                  <button
                    key={child.id_categoria}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected.has(child.id_categoria)}
                    onClick={() => onChange([child.id_categoria])}
                    className={cn(itemClass(selected.has(child.id_categoria)), "pl-8")}
                  >
                    {child.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default CategoryFilter;
