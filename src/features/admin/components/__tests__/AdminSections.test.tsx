import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  useAdminBusinesses: vi.fn(),
  useAdminUsers: vi.fn(),
}));

vi.mock("@/hooks/queries/useAdminQueries", () => ({
  useAdminBusinesses: mocks.useAdminBusinesses,
  useAdminUsers: mocks.useAdminUsers,
}));

vi.mock("@/hooks/mutations/useAdminMutations", () => ({
  useUpdateAdminBusiness: () => ({ mutateAsync: vi.fn() }),
  useDeleteAdminBusiness: () => ({ mutateAsync: vi.fn() }),
  useUpdateAdminUser: () => ({ mutateAsync: vi.fn() }),
  useToggleAdminUserStatus: () => ({ mutateAsync: vi.fn() }),
  useDeleteAdminUser: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { AdminBusinessesSection } from "@/features/admin/components/AdminBusinessesSection";
import { AdminUsersSection } from "@/features/admin/components/AdminUsersSection";

const makeQuery = (overrides: Record<string, unknown> = {}) => ({
  data: [],
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  ...overrides,
});

describe("AdminBusinessesSection", () => {
  beforeEach(() => {
    mocks.useAdminBusinesses.mockReset();
    mocks.useAdminUsers.mockReset();
  });

  it("no rompe si la API devuelve un objeto con items vacíos", () => {
    mocks.useAdminBusinesses.mockReturnValue(
      makeQuery({ data: { items: [], total: 0 } }),
    );

    render(<AdminBusinessesSection />);

    expect(screen.getByText("No se encontraron negocios")).toBeInTheDocument();
  });

  it("no rompe si la API devuelve null", () => {
    mocks.useAdminBusinesses.mockReturnValue(makeQuery({ data: null }));

    render(<AdminBusinessesSection />);

    expect(screen.getByText("No se encontraron negocios")).toBeInTheDocument();
  });

  it("muestra un estado de carga", () => {
    mocks.useAdminBusinesses.mockReturnValue(makeQuery({ isLoading: true }));

    render(<AdminBusinessesSection />);

    expect(screen.getByText("Cargando negocios...")).toBeInTheDocument();
  });

  it("muestra el error y permite reintentar", () => {
    const refetch = vi.fn();
    mocks.useAdminBusinesses.mockReturnValue(
      makeQuery({
        isError: true,
        error: new Error("403 Forbidden"),
        refetch,
      }),
    );

    render(<AdminBusinessesSection />);

    expect(screen.getByText("403 Forbidden")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

describe("AdminUsersSection", () => {
  beforeEach(() => {
    mocks.useAdminBusinesses.mockReset();
    mocks.useAdminUsers.mockReset();
  });

  it("no rompe si la API devuelve null", () => {
    mocks.useAdminUsers.mockReturnValue(makeQuery({ data: null }));

    render(<AdminUsersSection />);

    expect(screen.getByText("No se encontraron usuarios")).toBeInTheDocument();
  });

  it("no rompe si la API devuelve un envelope sin lista", () => {
    mocks.useAdminUsers.mockReturnValue(makeQuery({ data: { items: null } }));

    render(<AdminUsersSection />);

    expect(screen.getByText("No se encontraron usuarios")).toBeInTheDocument();
  });

  it("muestra el error y permite reintentar", () => {
    const refetch = vi.fn();
    mocks.useAdminUsers.mockReturnValue(
      makeQuery({
        isError: true,
        error: new Error("No autorizado"),
        refetch,
      }),
    );

    render(<AdminUsersSection />);

    expect(screen.getByText("No autorizado")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
