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

export interface ForgotPasswordRequest {
  email_us: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
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
  role?: string;
  role_us?: string;
  rol?: string;
  rol_us?: string;
  has_business?: boolean;
  negocio_id?: number | null;
  negocio_slug?: string | null;
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
  // RECUPERAR CONTRASEÑA
  // =========================

  requestPasswordReset: async (
    email: string
  ) => {
    return apiClient.postWithBase(
      AUTH_API_ROOT,
      "/forgot-password",
      {
        email_us: email,
      },
      undefined,
      true,
      true,
    );
  },

resetPassword: async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
    return apiClient.postWithBase(
    AUTH_API_ROOT,
    `/reset-password/${token}`,
    {
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
    undefined,
    true,
    true,
  );
},

  // =========================
  // VERIFICAR CREDENCIALES (2FA)
  // =========================

  verifyCredentials: async (
    data: LoginRequest
  ): Promise<void> => {
    return apiClient.postWithBase(
      AUTH_API_ROOT,
      "/verify-credentials",
      data,
      undefined,
      true,
      true,
    );
  },

  // =========================
  // VERIFICAR EMAIL
  // =========================

  verifyEmail: async (
    token: string
  ) => {
    return apiClient.getWithBase(
      AUTH_API_ROOT,
      `/verify-email/${token}`
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