import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import BookingResourceStep from "@/features/booking/components/BookingResourceStep";
import { useEspacios } from "@/hooks/queries/useEspaciosQuery";
import { useAvailableSlots } from "@/hooks/queries/useAvailableSlots";
import { useCategoriesTree } from "@/hooks/queries/useCategoriesTree";
import { isDeportesNegocio } from "@/lib/business-category";
import type { ApiEmpleado, ApiEspacio, ApiNegocio } from "@/types/api";

const get = vi.hoisted(() => vi.fn());
vi.mock("@/lib/api-client", () => ({
  default: { get, post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  ApiError: class extends Error {},
}));

const espacios: ApiEspacio[] = [
  { id_espacio: 10, id_cancha: 10, id_negocio: 1, nombre: "Cancha 1", activo: true },
  { id_espacio: 11, id_cancha: 11, id_negocio: 1, nombre: "Cancha 2", activo: true },
];
const profesionales = [
  { id_empleado: 7, id_negocio: 2, nombre: "Lucía", apellido: "Gómez", telefono: "1", activo: true },
] as ApiEmpleado[];

const renderStep = (multiEspacio: boolean) => {
  const onSelectEspacio = vi.fn();
  const onSelectProfessional = vi.fn();
  render(
    <BookingResourceStep
      multiEspacio={multiEspacio}
      espacios={espacios}
      professionals={profesionales}
      onSelectEspacio={onSelectEspacio}
      onSelectProfessional={onSelectProfessional}
    />,
  );
  return { onSelectEspacio, onSelectProfessional };
};

describe("BookingResourceStep", () => {
  it("muestra espacios (y no empleados) en un negocio multi-espacio", async () => {
    const { onSelectEspacio } = renderStep(true);

    expect(screen.getByText("Cancha 1")).toBeInTheDocument();
    expect(screen.getByText("Cancha 2")).toBeInTheDocument();
    expect(screen.queryByText(/Lucía/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancha 2"));
    expect(onSelectEspacio).toHaveBeenCalledWith(espacios[1]);
  });

  it("muestra empleados (y no espacios) en un negocio de servicios", async () => {
    const { onSelectProfessional } = renderStep(false);

    expect(screen.getByText(/Lucía/)).toBeInTheDocument();
    expect(screen.queryByText("Cancha 1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Lucía/));
    expect(onSelectProfessional).toHaveBeenCalledWith(profesionales[0]);
  });

  it("avisa cuando un negocio multi-espacio no tiene espacios", () => {
    render(
      <BookingResourceStep
        multiEspacio
        espacios={[]}
        professionals={[]}
        onSelectEspacio={vi.fn()}
        onSelectProfessional={vi.fn()}
      />,
    );
    expect(screen.getByText(/todavía no tiene espacios/)).toBeInTheDocument();
  });
});

describe("isDeportesNegocio con categorías jerárquicas", () => {
  const categories = [
    { id_categoria: 2, nombre: "Deportes" },
    { id_categoria: 3, nombre: "Fútbol", parent_id: 2 },
    { id_categoria: 1, nombre: "Belleza" },
  ];
  const negocio = (id: number, parent_id?: number) =>
    ({ categoria: { id_categoria: id, nombre: "x", parent_id } }) as ApiNegocio;

  it("reconoce sub-categorías de Deportes por su padre", () => {
    expect(isDeportesNegocio(negocio(3, 2), categories)).toBe(true);
    expect(isDeportesNegocio(negocio(1), categories)).toBe(false);
  });

  it("sin la lista de categorías una sub-categoría no se reconoce", () => {
    expect(isDeportesNegocio(negocio(3, 2))).toBe(false);
  });
});

describe("hooks de categorías y espacios", () => {
  beforeEach(() => get.mockReset());

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  );

  it("useEspacios pide /negocios/{id}/espacios y no consulta sin id", async () => {
    get.mockResolvedValue(espacios);
    const { result } = renderHook(() => useEspacios(1), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(espacios));
    expect(get).toHaveBeenCalledWith("/negocios/1/espacios", undefined);

    get.mockClear();
    renderHook(() => useEspacios(null), { wrapper });
    expect(get).not.toHaveBeenCalled();
  });

  it("useCategoriesTree pide /categorias/tree", async () => {
    get.mockResolvedValue([]);
    const { result } = renderHook(() => useCategoriesTree(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith("/categorias/tree");
  });

  it("useAvailableSlots filtra por categoría, fecha y estado", async () => {
    get.mockResolvedValue([]);
    const { result } = renderHook(() => useAvailableSlots(2, "2026-10-05", 2), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith("/turnos/disponibles", {
      categoria_padre: 2,
      fecha: "2026-10-05",
      estado: 2,
    });
  });
});

describe("isDeportesCategoria", () => {
  it("acepta Deportes y sus hijos, rechaza el resto", async () => {
    const { isDeportesCategoria } = await import("@/lib/business-category");
    const cats = [
      { id_categoria: 2, nombre: "Deportes" },
      { id_categoria: 3, nombre: "Pádel", parent_id: 2 },
      { id_categoria: 1, nombre: "Belleza" },
    ];
    expect(isDeportesCategoria(cats[0], cats)).toBe(true);
    expect(isDeportesCategoria(cats[1], cats)).toBe(true);
    expect(isDeportesCategoria(cats[2], cats)).toBe(false);
    expect(isDeportesCategoria(undefined, cats)).toBe(false);
  });
});
