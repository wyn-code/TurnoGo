import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

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

interface AuthContextType {
  user: User | null;

  token: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<AuthResult>;

  register: (
    usuario: string,
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ) => Promise<AuthResult>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "turnexo_user";
const TOKEN_KEY = "turnexo_token";

function normalizeUser(raw: Record<string, unknown>): User {
  const idRaw = raw.id_us ?? raw.id;

  const roleRaw =
    raw.role ??
    raw.rol ??
    raw.role_us;

  return {
    id: idRaw != null ? String(idRaw) : undefined,

    email: String(
      raw.email_us ??
      raw.email ??
      ""
    ),

    name:
      raw.usuario_us != null
        ? String(raw.usuario_us)
        : raw.name != null
          ? String(raw.name)
          : undefined,

    hasBusiness: Boolean(raw.has_business),

    role:
      roleRaw != null
        ? String(roleRaw).toLowerCase()
        : undefined,
  };
}

function normalizeApiDetail(detail: unknown): string {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        typeof e === "object" &&
        e &&
        "msg" in e
          ? String((e as { msg: string }).msg)
          : JSON.stringify(e),
      )
      .join(", ");
  }

  if (
    detail &&
    typeof detail === "object" &&
    "msg" in detail
  ) {
    return String(
      (detail as { msg: string }).msg
    );
  }

  return "Error al procesar la solicitud";
}

function loginBody(
  email: string,
  password: string,
) {
  return {
    email_us: email.trim(),
    contrasena_us: password,
  };
}

async function applySessionFromToken(
  token: string,
  setUser: (u: User | null) => void,
  setToken: (t: string | null) => void,
): Promise<AuthResult> {
  localStorage.setItem(
    TOKEN_KEY,
    token,
  );

  setToken(token);

  apiClient.setToken(token);

  try {
    const userData = await authService.me();

    const user = normalizeUser(
      userData as unknown as Record<
        string,
        unknown
      >,
    );

    setUser(user);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user),
    );

    return {
      success: true,
      user,
    };
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(USER_KEY);

    apiClient.clearToken();

    setUser(null);

    setToken(null);

    return {
      success: false,
      error:
        normalizeApiDetail(
          error instanceof Error
            ? error.message
            : error,
        ) || "No se pudo obtener el perfil",
    };
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const storedToken =
          localStorage.getItem(
            TOKEN_KEY,
          );

        if (storedToken) {
          apiClient.setToken(storedToken);

          const session =
            await applySessionFromToken(
              storedToken,
              setUser,
              setToken,
            );

          if (!session.success) {
            setUser(null);
            setToken(null);
          }

          return;
        }

        const storedUser =
          localStorage.getItem(
            USER_KEY,
          );

        if (storedUser) {
          localStorage.removeItem(USER_KEY);
        }
      } catch {
        localStorage.removeItem(
          USER_KEY,
        );

        localStorage.removeItem(
          TOKEN_KEY,
        );

        apiClient.clearToken();

        setUser(null);

        setToken(null);
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
    setIsLoading(true);

    try {
      const data =
        await authService.login(
          loginBody(
            email,
            password,
          ),
        );

      const token =
        data.access_token;

      if (!token) {
        return {
          success: false,
          error:
            "Respuesta del servidor sin token",
        };
      }

      return await applySessionFromToken(
        token,
        setUser,
        setToken,
      );
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      return {
        success: false,
        error: normalizeApiDetail(
          error?.response?.data
            ?.detail ||
            error?.message ||
            error,
        ),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    usuario: string,
    email: string,
    password: string,
    nombre: string,
    apellido: string,
  ): Promise<AuthResult> => {
    setIsLoading(true);

    try {
      const data =
        await authService.register({
          usuario_us:
            usuario.trim(),

          email_us:
            email.trim(),

          contrasena_us:
            password,

          nombre_us:
            nombre.trim(),

          apellido_us:
            apellido.trim(),
        });

      const token =
        data.access_token;

      // Si backend no devuelve token
      // intentamos login automático

      if (!token) {
        return await login(
          email,
          password,
        );
      }

      return await applySessionFromToken(
        token,
        setUser,
        setToken,
      );
    } catch (error: any) {
      console.error(
        "REGISTER ERROR:",
        error,
      );

      return {
        success: false,
        error: normalizeApiDetail(
          error?.response?.data
            ?.detail ||
            error?.message ||
            error,
        ),
      };
    } finally {
      setIsLoading(false);
    }
  };

const logout = () => {
  setUser(null);

  setToken(null);

  localStorage.removeItem(USER_KEY);

  localStorage.removeItem(TOKEN_KEY);

  apiClient.clearToken();
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        isAuthenticated:
          !!user && !!token,

        isLoading,

        login,

        register,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return ctx;
}