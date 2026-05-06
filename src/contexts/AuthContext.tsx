import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import apiClient from "@/lib/api-client";
import { authService } from "@/services/auth.service";

interface User {
  id?: string;
  email: string;
  name?: string;
  hasBusiness?: boolean;
  role?: string;
}

type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

function normalizeUser(raw: Record<string, unknown>): User {
  const idRaw = raw.id_us ?? raw.id;
  const roleRaw = raw.role ?? raw.rol ?? raw.role_us;

  return {
    id: idRaw != null ? String(idRaw) : undefined,
    email: String(raw.email_us ?? raw.email ?? ""),
    name:
      raw.usuario_us != null
        ? String(raw.usuario_us)
        : raw.name != null
          ? String(raw.name)
          : undefined,
    hasBusiness: Boolean(raw.has_business),
    role: roleRaw != null ? String(roleRaw).toLowerCase() : undefined,
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; user?: User; error?: string }>;

  // ACTUALIZA ESTA LÍNEA:
  register: (
    usuario: string,
    email: string,
    password: string,
    nombre: string, // <--- Agregar
    apellido: string, // <--- Agregar
  ) => Promise<{ success: boolean; user?: User; error?: string }>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "turnexo_user";
const TOKEN_KEY = "auth_token";

function normalizeApiDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        typeof e === "object" && e && "msg" in e
          ? String((e as { msg: string }).msg)
          : JSON.stringify(e),
      )
      .join(", ");
  }
  if (detail && typeof detail === "object" && "msg" in detail) {
    return String((detail as { msg: string }).msg);
  }
  return "Error al procesar la solicitud";
}

function loginBody(email: string, password: string) {
  return { email_us: email.trim(), contrasena_us: password };
}

async function applySessionFromToken(
  token: string,
  setUser: (u: User | null) => void,
) {
  localStorage.setItem(TOKEN_KEY, token);
  apiClient.setToken(token);

  try {
    const userData = await authService.me();

    const user = normalizeUser(userData as unknown as Record<string, unknown>);

    setUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("SET USER:", user);

    return { success: true as const, user };
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    apiClient.clearToken();
    setUser(null);

    return {
      success: false as const,
      error:
        normalizeApiDetail(error instanceof Error ? error.message : error) ||
        "No se pudo obtener el perfil",
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
          await applySessionFromToken(token, setUser);
          return;
        }

        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(
            normalizeUser(JSON.parse(storedUser) as Record<string, unknown>),
          );
        }
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    void initSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    try {
      const data = await authService.login(loginBody(email, password));

      const token = data.access_token as string | undefined;

      if (!token) {
        return { success: false, error: "Respuesta del servidor sin token" };
      }

      const session = await applySessionFromToken(token, setUser);
      setIsLoading(false);

      return session;
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);

      return {
        success: false,
        error:
          error?.response?.data?.detail ||
          error?.message ||
          "Error al iniciar sesión",
      };
    }
  };

  const register = async (
    usuario: string,
    email: string,
    password: string,
    nombre: string, // <--- Recibir
    apellido: string, // <--- Recibir
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const data = await authService.register({
        usuario_us: usuario.trim(),
        email_us: email.trim(),
        contrasena_us: password,
        nombre_us: nombre.trim(),
        apellido_us: apellido.trim(),
      });

      const token = data.access_token as string | undefined;

      if (!token) {
        // Intentar login automático si el registro no devolvió token pero fue exitoso
        const loginResult = await login(email, password);
        if (!loginResult.success) {
          return {
            success: false,
            error:
              "Cuenta creada pero no se pudo iniciar sesión automáticamente.",
          };
        }
        return { success: true, user: loginResult.user };
      }

      const session = await applySessionFromToken(token, setUser);
      return session.success ? { success: true, user: session.user } : session;
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        error: error?.response?.data?.detail || "Error al registrarse",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    apiClient.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
