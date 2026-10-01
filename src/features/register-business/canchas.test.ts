import { describe, it, expect } from "vitest";
import { schema } from "./schema";
import { defaultValues } from "./defaults";
import { toCreateCompleteBusinessRequest } from "./mapper";

const horariosValidos = defaultValues.horarios;

function baseForm(overrides: Record<string, unknown> = {}) {
  return {
    ...defaultValues,
    nombre: "Club Padle",
    id_categoria: 9,
    descripcion: "Alquiler de canchas",
    wsp: "3364555000",
    direccion: "Mitre 123",
    ciudad: "San Nicolas",
    id_provincia: 1,
    logo: "https://cdn.test/logo.png",
    servicios: [
      { nombre_servicio: "Cancha 1 hora", duracion_min: 60, precio: 5000, activo: true },
    ],
    horarios: horariosValidos,
    ...overrides,
  };
}

describe("schema de onboarding", () => {
  it("exige al menos un empleado cuando el negocio no es de Deportes", () => {
    const result = schema.safeParse(
      baseForm({ es_deportes: false, empleados: [{ nombre: "", apellido: "" }] }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "empleados")).toBe(true);
    }
  });

  it("permite negocios de Deportes sin empleados", () => {
    const result = schema.safeParse(
      baseForm({ es_deportes: true, cantidad_espacios: 3, empleados: [] }),
    );

    expect(result.success).toBe(true);
  });

  it("exige al menos un espacio para negocios de Deportes", () => {
    const result = schema.safeParse(
      baseForm({ es_deportes: true, cantidad_espacios: 0, empleados: [] }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "cantidad_espacios"),
      ).toBe(true);
    }
  });
});

describe("toCreateCompleteBusinessRequest", () => {
  it("manda cantidad_espacios y ningún empleado para Deportes", () => {
    const form = baseForm({ es_deportes: true, cantidad_espacios: 4, empleados: [] });
    const payload = toCreateCompleteBusinessRequest(
      schema.parse(form),
      7,
    );

    expect(payload.cantidad_espacios).toBe(4);
    expect(payload.empleados).toEqual([]);
    expect(payload.canchas).toBeUndefined();
  });

  it("manda los empleados y omite cantidad_espacios para el resto", () => {
    const form = baseForm({
      es_deportes: false,
      cantidad_espacios: 4,
      empleados: [{ nombre: "Juan", apellido: "Perez" }],
    });
    const payload = toCreateCompleteBusinessRequest(
      schema.parse(form),
      7,
    );

    expect(payload.canchas).toBeUndefined();
    expect(payload["cantidad_espacios" as keyof typeof payload]).toBeUndefined();
    expect(payload.empleados).toHaveLength(1);
    expect(payload.empleados[0]).toMatchObject({
      nombre: "Juan",
      apellido: "Perez",
      activo: true,
    });
  });
});
