import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const mockLogout = vi.fn();

const authMock = vi.fn();

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => authMock(),
}));

function renderNavbar(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Navbar />
    </MemoryRouter>
  );
}

function useAuthState({
  isLoading = false,
  isAuthenticated = false,
  user = null,
}: {
  isLoading?: boolean;
  isAuthenticated?: boolean;
  user?: { email: string } | null;
} = {}) {
  return { user, isAuthenticated, isLoading, logout: mockLogout };
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockReset();
});

describe("Navbar - botón 'Registrar negocio'", () => {
  it("no muestra el botón mientras el AuthContext resuelve la sesión (loading)", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: true }));
    renderNavbar();

    expect(screen.queryByText("Registrar negocio")).toBeNull();
  });

  it("no muestra el botón en ningún momento al recargar (F5) estando logueado", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: true }));
    const { rerender } = renderNavbar();

    expect(screen.queryByText("Registrar negocio")).toBeNull();

    authMock.mockReturnValue(
      useAuthState({ isLoading: false, isAuthenticated: true, user: { email: "a@b.com" } })
    );
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByText("Registrar negocio")).toBeNull();
    expect(screen.getByText("Explorar negocios")).toBeDefined();
  });

  it("no muestra el botón cuando el usuario está autenticado", () => {
    authMock.mockReturnValue(
      useAuthState({ isLoading: false, isAuthenticated: true, user: { email: "a@b.com" } })
    );
    renderNavbar();

    expect(screen.queryByText("Registrar negocio")).toBeNull();
  });

  it("muestra el botón cuando no hay sesión y no está en una ruta de auth", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: false, isAuthenticated: false }));
    renderNavbar();

    expect(screen.getByText("Registrar negocio")).toBeDefined();
  });

  it("no muestra el botón en /login aunque no haya sesión", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: false, isAuthenticated: false }));
    renderNavbar("/login");

    expect(screen.queryByText("Registrar negocio")).toBeNull();
  });

  it("no muestra el botón en /registro aunque no haya sesión", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: false, isAuthenticated: false }));
    renderNavbar("/registro");

    expect(screen.queryByText("Registrar negocio")).toBeNull();
  });

  it("mantiene 'Explorar negocios' y el ícono de usuario en todos los estados", () => {
    authMock.mockReturnValue(useAuthState({ isLoading: true }));
    renderNavbar();

    expect(screen.getByText("Explorar negocios")).toBeDefined();
  });
});
