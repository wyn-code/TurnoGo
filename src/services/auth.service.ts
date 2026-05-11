import apiClient from "@/lib/api-client";
import { AUTH_API_ROOT } from "@/lib/api-config";

const TOKEN_KEY = "turnexo_token";
const USER_KEY = "turnexo_user";

export interface LoginRequest {
  email_us: string;
  contrasena_us: string;
}

export interface RegisterRequest {
  usuario_us: string;
  email_us: string;
  contrasena_us: string;
  nombre_us: string;
  apellido_us: string;
  role?: string;
  rol?: string;
  role_us?: string;
  rol_us?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthUserResponse {
  id_us: string | number;
  email_us: string;
  usuario_us: string;
  nombre_us: string;
}

export const authService = {
  // =========================
  // API
  // =========================

  login: async (
    data: LoginRequest
  ): Promise<AuthTokenResponse> => {
    return apiClient.postWithBase<AuthTokenResponse>(
      AUTH_API_ROOT,
      "/login",
      data,
      undefined,
      true,
      true,
    );
  },

  register: async (
    data: RegisterRequest
  ): Promise<AuthTokenResponse> => {
    return apiClient.postWithBase<AuthTokenResponse>(
      AUTH_API_ROOT,
      "/register",
      {
        ...data,
        role: "duenio",
        rol: "duenio",
        role_us: "duenio",
        rol_us: "duenio",
      },
      undefined,
      true,
      true,
    );
  },

  me: async (): Promise<AuthUserResponse> => {
    return apiClient.getWithBase<AuthUserResponse>(
      AUTH_API_ROOT,
      "/me"
    );
  },

  // =========================
  // TOKEN
  // =========================

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // =========================
  // USER
  // =========================

  saveUser(user: AuthUserResponse) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },

  getUser(): AuthUserResponse | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  // =========================
  // SESSION
  // =========================

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;