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
}

export interface AuthTokenResponse {
  access_token?: string;
  token_type?: string;
}

export interface AuthUserResponse {
  id_us?: string | number;
  id?: string | number;
  email_us?: string;
  email?: string;
  usuario_us?: string;
  name?: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    return apiClient.postWithBase<AuthTokenResponse>(
      AUTH_API_ROOT,
      "/login",
      data,
      undefined,
      true,
    );
  },

  register: async (data: RegisterRequest) => {
    return apiClient.postWithBase<AuthTokenResponse>(
      AUTH_API_ROOT,
      "/register",
      data,
      undefined,
      true,
    );
  },

  me: async () => {
    return apiClient.getWithBase<AuthUserResponse>(AUTH_API_ROOT, "/me");
  },
};

export default authService;
