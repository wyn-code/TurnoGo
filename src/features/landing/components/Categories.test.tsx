import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Categories from "./Categories";
import type { ApiCategoryTop } from "@/types/api";

const get = vi.hoisted(() => vi.fn());
vi.mock("@/lib/api-client", () => ({
  default: { get, post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  ApiError: class extends Error {},
}));

const cat = (id: number, nombre: string, n: number, parent_id: number | null = null): ApiCategoryTop => ({
  id_categoria: id,
  nombre,
  parent_id,
  icono: null,
  descripcion: null,
  cantidad_negocios: n,
});

const top = [
  cat(1, "Peluqueria", 9),
  cat(4, "Cancha de Padel", 7, 7),
  cat(3, "Servicios Tecnicos", 5),
  cat(5, "Cancha de Futbol", 3, 7),
  cat(2, "Barberia", 1),
];

const Ubicacion = () => {
  const { pathname, search } = useLocation();
  return <p data-testid="ubicacion">{pathname + search}</p>;
};

const renderHome = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/negocios" element={<Ubicacion />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("Categories (home): top 5", () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue(top);
  });

  it("pide el top 5 al endpoint y renderiza las 5 categorías en orden", async () => {
    renderHome();

    await waitFor(() => expect(screen.getAllByText("Peluqueria").length).toBeGreaterThan(0));
    expect(get).toHaveBeenCalledWith("/categorias/top", { limit: 5 });

    // La vista desktop y la mobile renderizan cada categoría.
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    const desktop = titulos.slice(0, 5);
    expect(desktop).toEqual(top.map((c) => c.nombre));
  });

  it("click en una sub-categoría navega al listado filtrado por esa categoría", async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText("Cancha de Padel").length).toBeGreaterThan(0));

    fireEvent.click(screen.getAllByRole("button", { name: /Cancha de Padel/ })[0]);

    expect(screen.getByTestId("ubicacion")).toHaveTextContent("/negocios?categoria=4");
  });

  it("click en una categoría simple navega con su id", async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText("Barberia").length).toBeGreaterThan(0));

    fireEvent.click(screen.getAllByRole("button", { name: /Barberia/ })[0]);

    expect(screen.getByTestId("ubicacion")).toHaveTextContent("/negocios?categoria=2");
  });

  it("regresión: Básquet y Vóley no aparecen en la home", async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText("Peluqueria").length).toBeGreaterThan(0));

    expect(screen.queryByText(/b[aá]squet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/v[oó]ley/i)).not.toBeInTheDocument();
  });
});
