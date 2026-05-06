import apiClient from "@/lib/api-client";
import { AUTH_API_ROOT } from "@/lib/api-config";

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
  login: async (data: LoginRequest): Promise<AuthTokenResponse> => {
    return apiClient.postWithBase<AuthTokenResponse>(
      AUTH_API_ROOT,
      "/login",
      data,
      undefined,
      true,
      true,
    );
  },

  register: async (data: RegisterRequest): Promise<AuthTokenResponse> => {
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
    return apiClient.getWithBase<AuthUserResponse>(AUTH_API_ROOT, "/me");
  },
};

export default authService;
