import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AUTH_API_ROOT } from "@/lib/api-config";
import apiClient from "@/lib/api-client";

interface User {
  id?: string;
  email: string;
  name?: string;
  hasBusiness?: boolean; // 👈 NUEVO
}

function normalizeUser(raw: Record<string, unknown>): User {
  const idRaw = raw.id_us ?? raw.id;

  return {
    id: idRaw != null ? String(idRaw) : undefined,
    email: String(raw.email_us ?? raw.email ?? ""),
    name:
      raw.usuario_us != null
        ? String(raw.usuario_us)
        : raw.name != null
        ? String(raw.name)
        : undefined,
    hasBusiness: Boolean(raw.has_business), // 👈 NUEVO (ajustar según backend)
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;  register: (
    usuario: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "turnexo_user";
/** Misma clave que usa `api-client` para peticiones autenticadas */
const TOKEN_KEY = "auth_token";

function normalizeApiDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (typeof e === "object" && e && "msg" in e ? String((e as { msg: string }).msg) : JSON.stringify(e)))
      .join(", ");
  }
  if (detail && typeof detail === "object" && "msg" in detail) {
    return String((detail as { msg: string }).msg);
  }
  return "Error al procesar la solicitud";
}

/** El backend solo acepta `email_us` + `contrasena_us` (email válido). */
function loginBody(email: string, password: string) {
  return { email_us: email.trim(), contrasena_us: password };
}

async function applySessionFromToken(
  token: string,
  setUser: (u: User | null) => void
) {
  localStorage.setItem(TOKEN_KEY, token);
  apiClient.setToken(token);

  const meRes = await fetch(`${AUTH_API_ROOT}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const userData = await meRes.json().catch(() => null);

  if (!meRes.ok) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    apiClient.clearToken();
    setUser(null);
    return {
      success: false as const,
      error:
        normalizeApiDetail(userData?.detail) ||
        "No se pudo obtener el perfil",
    };
  }

  const user = normalizeUser(userData as Record<string, unknown>);
  setUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { success: true as const, user }; // 👈 IMPORTANTE
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        apiClient.setToken(token);
      }
      if (storedUser) {
        setUser(normalizeUser(JSON.parse(storedUser) as Record<string, unknown>));
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      apiClient.clearToken();
    }
    setIsLoading(false);
  }, []);

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${AUTH_API_ROOT}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginBody(email, password)),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: normalizeApiDetail(data.detail) || "Error al iniciar sesión",
      };
    }

    const token = data.access_token as string | undefined;

    if (!token) {
      return { success: false, error: "Respuesta del servidor sin token" };
    }

    const session = await applySessionFromToken(token, setUser);
    setIsLoading(false);

    return session; // 👈 ahora devuelve user también
  } catch (error) {
    console.error(error);
    setIsLoading(false);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
};

  const register = async (usuario: string, email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_API_ROOT}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_us: usuario.trim(),
          email_us: email.trim(),
          contrasena_us: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          error: normalizeApiDetail(data.detail) || "Error al registrarse",
        };
      }

      const token = data.access_token as string | undefined;

      if (!token) {
        const loginResult = await login(email, password);
        if (!loginResult.success) {
          return {
            success: false,
            error: "Cuenta creada pero no se pudo iniciar sesión. Probá iniciar sesión manualmente.",
          };
        }
        setIsLoading(false);
        return { success: true };
      }

      const session = await applySessionFromToken(token, setUser);
      setIsLoading(false);
      return session.success ? { success: true } : session;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return {
        success: false,
        error: "Error de conexión con el servidor",
      };
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
