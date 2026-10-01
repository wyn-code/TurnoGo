import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CategoryFilter from "@/components/CategoryFilter";
import {
  flattenTree,
  idsWithDescendants,
  matchesCategories,
} from "@/lib/category-tree";
import type { ApiCategoryTree } from "@/types/api";

const node = (
  id: number,
  nombre: string,
  children: ApiCategoryTree[] = [],
  parent_id: number | null = null,
): ApiCategoryTree => ({ id_categoria: id, nombre, parent_id, children });

// Estructura final: Deportes agrupa las canchas; el resto son categorías simples.
const tree: ApiCategoryTree[] = [
  node(2, "Barberia"),
  node(3, "Servicios Tecnicos"),
  node(7, "Deportes", [
    node(5, "Cancha de Futbol", [], 7),
    node(10, "Cancha de Tenis", [], 7),
    node(4, "Cancha de Padel", [], 7),
  ]),
  node(1, "Peluqueria"),
];

const negocios = [
  { nombre: "Camp Nou", id_categoria: 5 },
  { nombre: "El Galpon", id_categoria: 4 },
  { nombre: "Tono", id_categoria: 1 },
  { nombre: "Don Barbero", id_categoria: 2 },
];

/** Filtro + listado, igual que la página de negocios. */
const Harness = ({ onChange = vi.fn() }) => {
  const [ids, setIds] = useState<number[]>([]);
  return (
    <>
      <CategoryFilter
        tree={tree}
        selectedIds={ids}
        onChange={(next) => {
          setIds(next);
          onChange(next);
        }}
      />
      <ul data-testid="resultados">
        {negocios
          .filter((n) => matchesCategories(n.id_categoria, ids))
          .map((n) => (
            <li key={n.nombre}>{n.nombre}</li>
          ))}
      </ul>
    </>
  );
};

const resultados = () =>
  screen.getByTestId("resultados").textContent;

describe("CategoryFilter (acordeón)", () => {
  it("muestra las categorías sin hijos como ítems simples y Deportes colapsado", () => {
    render(<Harness />);
    for (const nombre of ["Todas", "Barberia", "Servicios Tecnicos", "Peluqueria"]) {
      expect(screen.getByRole("button", { name: nombre })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Deportes" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Cancha de Padel")).not.toBeInTheDocument();
  });

  it("click en Deportes sólo expande: muestra las 3 canchas indentadas y no filtra", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Deportes" }));

    for (const nombre of ["Cancha de Futbol", "Cancha de Tenis", "Cancha de Padel"]) {
      expect(screen.getByRole("button", { name: nombre })).toHaveAttribute("aria-pressed", "false");
    }
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(resultados()).toContain("Tono"); // sin filtro

    fireEvent.click(screen.getByRole("button", { name: "Deportes" }));
    expect(screen.queryByText("Cancha de Padel")).not.toBeInTheDocument();
  });

  it("click en Cancha de Padel la marca activa (como una categoría simple) y filtra", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Deportes" }));
    const padel = screen.getByRole("button", { name: "Cancha de Padel" });
    fireEvent.click(padel);

    expect(padel).toHaveAttribute("aria-pressed", "true");
    // Mismo estado "seleccionado" que una categoría simple activa.
    fireEvent.click(screen.getByRole("button", { name: "Barberia" }));
    expect(padel.className).not.toContain("bg-primary");
    expect(screen.getByRole("button", { name: "Barberia" }).className).toContain("bg-primary");
    fireEvent.click(padel);
    expect(padel.className).toContain("bg-primary");
    expect(resultados()).toBe("El Galpon");
    // El padre sigue expandido y no se marca como seleccionado.
    expect(screen.getByRole("button", { name: "Deportes" })).toHaveAttribute("aria-expanded", "true");
  });

  it("es selección única: elegir otro hijo o categoría desmarca el anterior", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Deportes" }));
    const padel = screen.getByRole("button", { name: "Cancha de Padel" });
    const futbol = screen.getByRole("button", { name: "Cancha de Futbol" });

    fireEvent.click(padel);
    fireEvent.click(futbol);
    expect(padel).toHaveAttribute("aria-pressed", "false");
    expect(futbol).toHaveAttribute("aria-pressed", "true");
    expect(resultados()).toBe("Camp Nou");

    fireEvent.click(screen.getByRole("button", { name: "Peluqueria" }));
    expect(futbol).toHaveAttribute("aria-pressed", "false");
    expect(resultados()).toBe("Tono");
    // Deportes sigue abierto aunque ya no contiene la selección.
    expect(screen.getByRole("button", { name: "Cancha de Padel" })).toBeInTheDocument();
  });

  it("regresión: las categorías simples (Barberia, Servicios Tecnicos, Peluqueria) filtran directo", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "Peluqueria" }));
    expect(resultados()).toBe("Tono");

    fireEvent.click(screen.getByRole("button", { name: "Barberia" }));
    expect(resultados()).toBe("Don Barbero");

    fireEvent.click(screen.getByRole("button", { name: "Servicios Tecnicos" }));
    expect(resultados()).toBe(""); // sin negocios en la fixture
  });

  it('"Todas" limpia la selección', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Barberia" }));
    fireEvent.click(screen.getByRole("button", { name: "Todas" }));

    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(resultados()).toContain("Camp Nou");
  });

  it("abre el padre cuando la selección inicial incluye una cancha", () => {
    render(<CategoryFilter tree={tree} selectedIds={[4]} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Cancha de Padel" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("category-tree", () => {
  it("flattenTree lista padres antes que hijos", () => {
    expect(flattenTree(tree).map((c) => c.nombre)).toEqual([
      "Barberia", "Servicios Tecnicos", "Deportes",
      "Cancha de Futbol", "Cancha de Tenis", "Cancha de Padel", "Peluqueria",
    ]);
  });

  it("idsWithDescendants devuelve el subárbol o vacío si no existe", () => {
    expect(idsWithDescendants(tree, 7).sort((a, b) => a - b)).toEqual([4, 5, 7, 10]);
    expect(idsWithDescendants(tree, 4)).toEqual([4]);
    expect(idsWithDescendants(tree, 99)).toEqual([]);
  });

  it("matchesCategories: sin selección pasan todos los negocios", () => {
    expect(matchesCategories(3, [])).toBe(true);
    expect(matchesCategories(3, [3])).toBe(true);
    expect(matchesCategories(1, [3, 4])).toBe(false);
  });
});
