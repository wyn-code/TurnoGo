import type { ApiCategory, ApiNegocio } from "@/types/api";

/**
 * La tabla `categorias` no tiene código ni slug, solo `nombre`. La categoría
 * "Deportes" reserva espacios (canchas) en lugar de empleados, así que el
 * nombre es la única clave disponible para ramificar el flujo.
 *
 * Espejo de `CATEGORIA_DEPORTES` en app/services/negocio_service.py.
 */
export const CATEGORIA_DEPORTES = "Deportes";

type NegocioConCategoria = Pick<ApiNegocio, "categoria"> | null | undefined;

const esNombreDeportes = (nombre: string | null | undefined): boolean =>
  (nombre ?? "").trim().toLowerCase() === CATEGORIA_DEPORTES.toLowerCase();

/** ¿La categoría es Deportes o una sub-categoría suya? */
export const isDeportesCategoria = (
  categoria: Pick<ApiCategory, "nombre" | "parent_id"> | null | undefined,
  categories: ApiCategory[] = [],
): boolean => {
  if (!categoria) return false;
  if (esNombreDeportes(categoria.nombre)) return true;

  const parent =
    categoria.parent_id != null
      ? categories.find((c) => c.id_categoria === categoria.parent_id)
      : undefined;
  return esNombreDeportes(parent?.nombre);
};

/**
 * ¿El negocio reserva espacios deportivos en vez de empleados?
 *
 * Con categorías jerárquicas también cuentan las sub-categorías de Deportes
 * (Fútbol, Pádel…): pasá la lista de categorías para resolver el padre.
 */
export const isDeportesNegocio = (
  negocio: NegocioConCategoria,
  categories: ApiCategory[] = [],
): boolean => isDeportesCategoria(negocio?.categoria, categories);

/** Título del paso "recurso" de la reserva según el tipo de negocio. */
export const resourceStepTitle = (multiEspacio: boolean): string =>
  multiEspacio ? "Elegí un espacio" : "Elegí un profesional";
