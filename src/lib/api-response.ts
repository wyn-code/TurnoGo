/**
 * Helpers para normalizar respuestas de la API.
 *
 * Los endpoints de listado pueden devolver un array plano o un envelope
 * paginado (`{ items: [...] }`). Si la respuesta es inválida (null, undefined,
 * un objeto sin lista) devolvemos una lista vacía para que la UI no rompa.
 */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function extractItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (isRecord(payload)) {
    if (Array.isArray(payload.items)) {
      return payload.items as T[];
    }

    if (Array.isArray(payload.data)) {
      return payload.data as T[];
    }
  }

  return [];
}

export function extractTotalPages(payload: unknown, fallback = 1): number {
  if (isRecord(payload)) {
    const totalPages = payload.total_pages;

    if (
      typeof totalPages === "number" &&
      Number.isFinite(totalPages) &&
      totalPages > 0
    ) {
      return Math.floor(totalPages);
    }
  }

  return fallback;
}
