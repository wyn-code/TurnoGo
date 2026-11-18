import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-client", () => ({
  default: {
    get,
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class ApiError extends Error {},
}));

import { businessService } from "@/services/business.service";
import { userService } from "@/services/user.service";
import type { ApiCategoryTree } from "@/types/api";

describe("businessService.getAllAdmin", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("extrae los items y recorre todas las páginas del envelope", async () => {
    get
      .mockResolvedValueOnce({
        items: [{ id_negocio: 1, nombre: "Uno" }],
        total: 2,
        page: 1,
        page_size: 100,
        total_pages: 2,
      })
      .mockResolvedValueOnce({
        items: [{ id_negocio: 2, nombre: "Dos" }],
        total: 2,
        page: 2,
        page_size: 100,
        total_pages: 2,
      });

    const negocios = await businessService.getAllAdmin();

    expect(negocios.map((n) => n.id_negocio)).toEqual([1, 2]);
    expect(get).toHaveBeenNthCalledWith(1, "/negocios/admin", {
      page: 1,
      page_size: 100,
    });
    expect(get).toHaveBeenNthCalledWith(2, "/negocios/admin", {
      page: 2,
      page_size: 100,
    });
  });

  it("sigue aceptando un array plano (contrato anterior)", async () => {
    get.mockResolvedValueOnce([{ id_negocio: 1, nombre: "Uno" }]);

    await expect(businessService.getAllAdmin()).resolves.toHaveLength(1);
  });

  it.each([
    ["respuesta null", null],
    ["respuesta undefined", undefined],
    ["envelope sin items", { items: null, total: 0 }],
    ["envelope vacío", { items: [], total: 0, total_pages: 1 }],
    ["objeto inesperado", { data: "no-es-una-lista" }],
  ])("devuelve [] ante %s", async (_label, payload) => {
    get.mockResolvedValueOnce(payload);

    await expect(businessService.getAllAdmin()).resolves.toEqual([]);
  });

  it("propaga los errores HTTP en lugar de tragárselos", async () => {
    get.mockRejectedValueOnce(new Error("403 Forbidden"));

    await expect(businessService.getAllAdmin()).rejects.toThrow("403 Forbidden");
  });
});

describe("userService.getAllAdmin", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("normaliza un array plano de usuarios", async () => {
    get.mockResolvedValueOnce([
      {
        id_us: 1,
        usuario_us: "admin",
        email_us: "admin@test.com",
        role_us: "admin",
        estado: true,
        negocio: "",
      },
    ]);

    await expect(userService.getAllAdmin()).resolves.toEqual([
      {
        id_us: 1,
        usuario_us: "admin",
        email_us: "admin@test.com",
        role_us: "admin",
        rol: undefined,
        estado: true,
        negocio: "",
      },
    ]);
  });

  it("extrae items si el backend paginara usuarios en el futuro", async () => {
    get.mockResolvedValueOnce({
      items: [
        {
          id_us: 2,
          usuario_us: "duenio",
          email_us: "duenio@test.com",
          role_us: "duenio",
          estado: false,
        },
      ],
      total_pages: 1,
    });

    const users = await userService.getAllAdmin();

    expect(users).toHaveLength(1);
    expect(users[0].id_us).toBe(2);
  });

  it.each([null, undefined, { items: null }, {}])(
    "devuelve [] ante una respuesta inválida (%s)",
    async (payload) => {
      get.mockResolvedValueOnce(payload);

      await expect(userService.getAllAdmin()).resolves.toEqual([]);
    },
  );

  it("propaga los errores HTTP", async () => {
    get.mockRejectedValueOnce(new Error("403 Forbidden"));

    await expect(userService.getAllAdmin()).rejects.toThrow("403 Forbidden");
  });
});

describe("businessService.getCategoriesTree", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("normaliza parent_id y children para que el filtro no rompa", async () => {
    get.mockResolvedValueOnce([
      {
        id_categoria: 1,
        nombre: "Deportes",
        parent_id: undefined,
        children: [
          {
            id_categoria: 2,
            nombre: "Pádel",
            parent_id: null,
            children: null,
          },
        ],
      },
    ]);

    const tree = await businessService.getCategoriesTree();

    expect(tree[0].parent_id).toBeNull();
    expect(tree[0].children[0].children).toEqual([]);
  });

  it("devuelve [] si el árbol viene como null", async () => {
    get.mockResolvedValueOnce(null);

    const tree: ApiCategoryTree[] = await businessService.getCategoriesTree();
    expect(tree).toEqual([]);
  });
});
