import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerificarCodigo from "./VerificarCodigo";

vi.mock("sonner", () => ({
  toast: { info: vi.fn(), success: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock("@/features/landing/components/Navbar", () => ({
  default: () => <nav data-testid="navbar" />,
}));

vi.mock("@/features/landing/components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("@/components/ui/input-otp", () => ({
  InputOTP: ({ value, onChange, maxLength }: { value: string; onChange: (v: string) => void; maxLength: number }) => (
    <input
      data-testid="otp-input"
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  InputOTPGroup: ({ children }: { children: unknown }) => <>{children}</>,
  InputOTPSlot: () => null,
}));

const mockLogin = vi.fn();
const PENDING_KEY = "turnexo_pending_2fa";

interface PendingData {
  email: string;
  password: string;
  code: string;
  from: string;
  expiresAt: number;
}

function setupPending(overrides: Partial<PendingData> = {}) {
  const pending: PendingData = {
    email: "test@example.com",
    password: "Pass1234!",
    code: "123456",
    from: "/dashboard",
    expiresAt: Date.now() + 300000,
    ...overrides,
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  return pending;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/verificar-codigo"]}>
      <VerificarCodigo />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("VerificarCodigo", () => {
  it("redirige a /login si no hay pending data", async () => {
    renderPage();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("muestra el formulario con OTP input cuando hay pending data", () => {
    setupPending();
    renderPage();
    expect(screen.getByText("Verificación en dos pasos")).toBeDefined();
    expect(screen.getByTestId("otp-input")).toBeDefined();
    expect(screen.getByText("Verificar e iniciar sesión")).toBeDefined();
  });

  it("muestra el email enmascarado", () => {
    setupPending({ email: "bruno@test.com" });
    renderPage();
    expect(screen.getByText("b***o@test.com")).toBeDefined();
  });

  it("deshabilita el submit si el código tiene menos de 6 dígitos", () => {
    setupPending();
    renderPage();
    const input = screen.getByTestId("otp-input");
    fireEvent.change(input, { target: { value: "123" } });
    const btn = screen.getByRole("button", { name: /Verificar e iniciar sesión/ });
    expect(btn).toBeDisabled();
  });

  it("habilita el submit con código de 6 dígitos", () => {
    setupPending();
    renderPage();
    const input = screen.getByTestId("otp-input");
    fireEvent.change(input, { target: { value: "123456" } });
    const btn = screen.getByRole("button", { name: /Verificar e iniciar sesión/ });
    expect(btn).not.toBeDisabled();
  });

  it("muestra error si el código es incorrecto", async () => {
    setupPending({ code: "123456" });
    renderPage();
    const input = screen.getByTestId("otp-input");
    fireEvent.change(input, { target: { value: "999999" } });
    const btn = screen.getByRole("button", { name: /Verificar e iniciar sesión/ });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(screen.getByText("El código es incorrecto. Verificá e intentá de nuevo.")).toBeDefined();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("llama login y navega al dashboard con código correcto", async () => {
    setupPending({ code: "123456", from: "/dashboard" });
    mockLogin.mockResolvedValue({ success: true });
    renderPage();
    const input = screen.getByTestId("otp-input");
    fireEvent.change(input, { target: { value: "123456" } });
    const btn = screen.getByRole("button", { name: /Verificar e iniciar sesión/ });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "Pass1234!");
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("muestra error cuando login falla", async () => {
    setupPending({ code: "123456" });
    mockLogin.mockResolvedValue({ success: false, error: "Credenciales inválidas" });
    renderPage();
    const input = screen.getByTestId("otp-input");
    fireEvent.change(input, { target: { value: "123456" } });
    const btn = screen.getByRole("button", { name: /Verificar e iniciar sesión/ });
    await act(async () => {
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeDefined();
    });
  });

  it("el botón reenviar tiene cooldown de 30s", async () => {
    setupPending();
    renderPage();
    const resendBtn = screen.getByRole("button", { name: "Reenviar código" });
    await act(async () => {
      fireEvent.click(resendBtn);
    });
    expect(screen.getByText(/Reenviar en \d+s/)).toBeDefined();
    expect(screen.getByRole("button", { name: /Reenviar en/ })).toBeDisabled();
  });

  it("redirige a /login al hacer clic en 'Volver a iniciar sesión'", () => {
    setupPending();
    renderPage();
    const link = screen.getByText("Volver a iniciar sesión");
    expect(link.closest("a")?.getAttribute("href")).toBe("/login");
  });
});
