import { describe, it, expect } from "vitest";
import { CATEGORIA_DEPORTES, isDeportesNegocio } from "./business-category";
import type { ApiNegocio } from "@/types/api";

function negocio(categoria: string | undefined | null): ApiNegocio {
  return {
    categoria: categoria == null ? null : { id_categoria: 1, nombre: categoria },
  } as ApiNegocio;
}

describe("isDeportesNegocio", () => {
  it("reconoce la categoría Deportes", () => {
    expect(isDeportesNegocio(negocio("Deportes"))).toBe(true);
  });

  it("ignora mayúsculas y espacios", () => {
    expect(isDeportesNegocio(negocio("  deportes "))).toBe(true);
  });

  it("devuelve false para el resto de las categorías", () => {
    expect(isDeportesNegocio(negocio("Peluquería"))).toBe(false);
    expect(isDeportesNegocio(negocio("Barbería"))).toBe(false);
  });

  it("devuelve false cuando no hay categoría", () => {
    expect(isDeportesNegocio(negocio(null))).toBe(false);
    expect(isDeportesNegocio(negocio(undefined))).toBe(false);
    expect(isDeportesNegocio(null)).toBe(false);
    expect(isDeportesNegocio(undefined)).toBe(false);
  });

  it("expone el mismo nombre de categoría que el backend", () => {
    expect(CATEGORIA_DEPORTES).toBe("Deportes");
  });
});
