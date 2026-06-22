import apiClient from "@/lib/api-client";
import type { ApiUsuario } from "@/types/api";

export interface UpdateUserRequest {
  usuario_us?: string;
  email_us?: string;
  role_us?: string;
  estado?: boolean;
}

function normalizeUser(raw: Record<string, unknown>): ApiUsuario {
  return {
    id_us: Number(raw.id_us),
    usuario_us: String(raw.usuario_us ?? ""),
    email_us: String(raw.email_us ?? ""),

    role_us:
      raw.role_us != null
        ? String(raw.role_us)
        : undefined,

    rol:
      raw.rol != null
        ? String(raw.rol)
        : undefined,

    estado: Boolean(
      raw.estado ?? false
    ),

    negocio:
      raw.negocio != null
        ? String(raw.negocio)
        : null,
  };
}

export const userService = {
  getAllAdmin: async (): Promise<ApiUsuario[]> => {
    const data = await apiClient.get<
      Record<string, unknown>[]
    >("/usuarios/admin");

    return data.map(normalizeUser);
  },

  update: async (
    id: number,
    data: UpdateUserRequest,
  ): Promise<ApiUsuario> => {
    const saved =
      await apiClient.put<Record<string, unknown>>(
        `/usuarios/${id}`,
        data,
      );

    return normalizeUser(saved);
  },

  toggleStatus: async (
    id: number,
    estado: boolean,
  ): Promise<ApiUsuario> => {
    const saved =
      await apiClient.patch<Record<string, unknown>>(
        `/usuarios/${id}/estado`,
        { estado },
      );

    return normalizeUser(saved);
  },

  delete: async (
    id: number,
  ): Promise<void> => {
    await apiClient.delete(
      `/usuarios/${id}`,
    );
  },
};

export default userService;