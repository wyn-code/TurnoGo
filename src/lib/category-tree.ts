import type { ApiCategory, ApiCategoryTree } from "@/types/api";

/** Todas las categorías del árbol en una lista plana (padres antes que hijos). */
export const flattenTree = (tree: ApiCategoryTree[]): ApiCategory[] =>
  tree.flatMap(({ children, ...cat }) => [cat, ...flattenTree(children)]);

/** Ids del nodo y de todos sus descendientes. */
export const subtreeIds = (node: ApiCategoryTree): number[] => [
  node.id_categoria,
  ...node.children.flatMap(subtreeIds),
];

/** Ids de una categoría (y sus descendientes) buscada por id dentro del árbol. */
export const idsWithDescendants = (
  tree: ApiCategoryTree[],
  id: number,
): number[] => {
  for (const node of tree) {
    if (node.id_categoria === id) return subtreeIds(node);
    const found = idsWithDescendants(node.children, id);
    if (found.length) return found;
  }
  return [];
};

/** ¿Algún descendiente (no el propio nodo) está seleccionado? */
export const hasSelectedDescendant = (
  node: ApiCategoryTree,
  selected: ReadonlySet<number>,
): boolean =>
  node.children.some(
    (child) => selected.has(child.id_categoria) || hasSelectedDescendant(child, selected),
  );

/** Un negocio pasa el filtro si no hay selección o si su categoría está elegida. */
export const matchesCategories = (
  idCategoria: number,
  selectedIds: readonly number[],
): boolean => selectedIds.length === 0 || selectedIds.includes(idCategoria);
