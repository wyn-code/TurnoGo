import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RestablecerContrasena from "./RestablecerContrasena";

const mockNavigate = vi.fn();
const mockResetPassword = vi.fn();
const mockUseParams = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({ resetPassword: mockResetPassword }),
}));

vi.mock("@/features/landing/components/Navbar", () => ({
  default: () => <nav data-testid="navbar" />,
}));

vi.mock("@/features/landing/components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

function renderPage(initialRoute = "/restablecer-contrasena/valid-token-123") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <RestablecerContrasena />
    </MemoryRouter>
  );
}

function fillValidPassword(container: HTMLElement) {
  const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement;
  const confirmInput = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
  fireEvent.input(passwordInput, { target: { value: "Password1234@" } });
  fireEvent.input(confirmInput, { target: { value: "Password1234@" } });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ token: "valid-token-123" });
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RestablecerContrasena", () => {
  it("muestra el formulario de restablecimiento", () => {
    const { container } = renderPage();
    expect(screen.getByText("Restablecer contraseña")).toBeDefined();
    expect(container.querySelector('input[name="password"]')).toBeDefined();
    expect(container.querySelector('input[name="confirmPassword"]')).toBeDefined();
    expect(screen.getByRole("button", { name: "Aceptar" })).toBeDefined();
  });

  it("muestra error si no hay token en la URL", async () => {
    mockUseParams.mockReturnValue({});
    const { container } = renderPage("/restablecer-contrasena");
    fillValidPassword(container);
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText(/El enlace no es válido o expiró/)).toBeDefined();
    });
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("muestra error de validación si la contraseña es muy corta", async () => {
    const { container } = renderPage();
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmInput = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.input(passwordInput, { target: { value: "Corto1!" } });
      fireEvent.input(confirmInput, { target: { value: "Corto1!" } });
    });
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText("La contraseña debe tener al menos 12 caracteres")).toBeDefined();
    });
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    const { container } = renderPage();
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmInput = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.input(passwordInput, { target: { value: "Password1234@" } });
      fireEvent.input(confirmInput, { target: { value: "Different1234@" } });
    });
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText("Las contraseñas no coinciden")).toBeDefined();
    });
  });

  it("llama resetPassword y muestra éxito con contraseña válida", async () => {
    mockResetPassword.mockResolvedValue({ success: true });
    const { container } = renderPage();
    fillValidPassword(container);
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        "valid-token-123",
        "Password1234@",
        "Password1234@"
      );
    });
    expect(screen.getByText("¡Contraseña actualizada!")).toBeDefined();
    expect(screen.getByText("Te estamos redirigiendo al inicio de sesión...")).toBeDefined();
  });

  it("redirige a /login después del éxito", async () => {
    mockResetPassword.mockResolvedValue({ success: true });
    const { container } = renderPage();
    fillValidPassword(container);
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText("¡Contraseña actualizada!")).toBeDefined();
    });
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("muestra error del servidor cuando resetPassword falla", async () => {
    mockResetPassword.mockResolvedValue({ success: false, error: "Token inválido o expirado" });
    const { container } = renderPage();
    fillValidPassword(container);
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText("Token inválido o expirado")).toBeDefined();
    });
  });

  it("permite toggle de visibilidad de contraseña", () => {
    const { container } = renderPage();
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement;
    expect(passwordInput).toHaveProperty("type", "password");

    const toggleButtons = screen.getAllByRole("button", { name: "" });
    const eyeToggle = toggleButtons.find((btn) =>
      btn.querySelector(".lucide-eye")
    );
    if (eyeToggle) {
      fireEvent.click(eyeToggle);
      expect(passwordInput).toHaveProperty("type", "text");
    }
  });

  it("muestra link a /olvide-contrasena cuando no hay token", async () => {
    mockUseParams.mockReturnValue({});
    const { container } = renderPage("/restablecer-contrasena");
    fillValidPassword(container);
    const btn = screen.getByRole("button", { name: "Aceptar" });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      const link = screen.getByText("Solicitá uno nuevo");
      expect(link.closest("a")?.getAttribute("href")).toBe("/olvide-contrasena");
    });
  });

  it("muestra link a /login", () => {
    renderPage();
    const link = screen.getByText("Volver al inicio de sesión");
    expect(link.closest("a")?.getAttribute("href")).toBe("/login");
  });
});
