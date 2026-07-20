import { describe, it, expect } from "vitest";
import {
  getStatisticsPeriodRange,
  getStatisticsComparisonRange,
  buildDashboardStatistics,
  isPartialStatisticsPayload,
  mergeStatisticsPayload,
  mapLegacySummaryToStatistics,
} from "./statistics-utils";
import type { ApiTurno, ApiServicio, ApiEmpleado, ApiHorario } from "@/types/api";

// ── Helpers ──

function makeTurno(overrides: Partial<ApiTurno> = {}): ApiTurno {
  return {
    id_turno: 1,
    id_negocio: 1,
    id_cliente: 1,
    id_servicio: 1,
    id_estado: 1,
    id_empleado: null,
    fecha_hora_inicio: "2026-07-20T10:00:00",
    fecha_hora_fin: "2026-07-20T11:00:00",
    cliente: { nombre: "Juan", apellido: "Pérez", telefono: "1234" },
    empleado: null,
    servicio: { nombre_servicio: "Corte" },
    estado: { id_estado: 1, nombre: "Completado", nombre_estado: "Completado" },
    ...overrides,
  };
}

function makeService(overrides: Partial<ApiServicio> = {}): ApiServicio {
  return {
    id_servicio: 1,
    id_negocio: 1,
    nombre_servicio: "Corte",
    duracion_min: 30,
    duracion_max: 30,
    precio: 1000,
    activo: true,
    ...overrides,
  };
}

function makeEmployee(overrides: Partial<ApiEmpleado> = {}): ApiEmpleado {
  return {
    id_empleado: 1,
    id_negocio: 1,
    nombre: "María",
    apellido: "López",
    telefono: "5678",
    activo: true,
    ...overrides,
  };
}

function makeHorario(overrides: Partial<ApiHorario> = {}): ApiHorario {
  return {
    id_horarios_negocio: 1,
    id_negocio: 1,
    dia_semana: 1,
    hora_apertura: "09:00",
    hora_cierre: "18:00",
    activo: true,
    ...overrides,
  };
}

const REFERENCE = new Date(2026, 6, 20); // July 20, 2026 (Monday)

// ── getStatisticsPeriodRange ──

describe("getStatisticsPeriodRange", () => {
  it("hoy returns today's range", () => {
    const range = getStatisticsPeriodRange("hoy", REFERENCE);
    expect(range.desde).toContain("2026-07-20");
    expect(range.hasta).toContain("2026-07-20");
  });

  it("semana returns current week range", () => {
    const range = getStatisticsPeriodRange("semana", REFERENCE);
    expect(range.desde).toContain("2026-07-");
    expect(range.hasta).toContain("2026-07-");
  });

  it("mes returns current month range", () => {
    const range = getStatisticsPeriodRange("mes", REFERENCE);
    expect(range.desde).toContain("2026-07-01");
    expect(range.hasta).toContain("2026-07-31");
  });

  it("anio returns current year range", () => {
    const range = getStatisticsPeriodRange("anio", REFERENCE);
    expect(range.desde).toContain("2026-01-01");
    expect(range.hasta).toContain("2026-12-31");
  });
});

// ── getStatisticsComparisonRange ──

describe("getStatisticsComparisonRange", () => {
  it("mes anterior returns previous month", () => {
    const range = getStatisticsComparisonRange("mes", "anterior", REFERENCE);
    expect(range.desde).toContain("2026-06-01");
    expect(range.hasta).toContain("2026-06-30");
  });

  it("anio anterior returns previous year", () => {
    const range = getStatisticsComparisonRange("anio", "anterior", REFERENCE);
    expect(range.desde).toContain("2025-01-01");
    expect(range.hasta).toContain("2025-12-31");
  });

  it("hoy anterior returns yesterday", () => {
    const range = getStatisticsComparisonRange("hoy", "anterior", REFERENCE);
    expect(range.desde).toContain("2026-07-19");
    expect(range.hasta).toContain("2026-07-19");
  });

  it("semana anterior returns previous week", () => {
    const range = getStatisticsComparisonRange("semana", "anterior", REFERENCE);
    expect(range.desde).toContain("2026-07-");
  });

  it("anio compare returns previous year same range", () => {
    const range = getStatisticsComparisonRange("mes", "anio", REFERENCE);
    expect(range.desde).toContain("2025-07-01");
    expect(range.hasta).toContain("2025-07-31");
  });
});

// ── isPartialStatisticsPayload ──

describe("isPartialStatisticsPayload", () => {
  it("returns true for objects", () => {
    expect(isPartialStatisticsPayload({})).toBe(true);
    expect(isPartialStatisticsPayload({ kpis: {} })).toBe(true);
  });

  it("returns false for null/undefined/primitives", () => {
    expect(isPartialStatisticsPayload(null)).toBe(false);
    expect(isPartialStatisticsPayload(undefined)).toBe(false);
    expect(isPartialStatisticsPayload("string")).toBe(false);
    expect(isPartialStatisticsPayload(42)).toBe(false);
  });
});

// ── mergeStatisticsPayload ──

describe("mergeStatisticsPayload", () => {
  const localData = buildDashboardStatistics({
    appointments: [],
    services: [],
    employees: [],
    horarios: [],
    options: { rango: "mes", comparar: "anterior" },
    reference: REFERENCE,
  });

  it("returns localData when apiData is empty", () => {
    const result = mergeStatisticsPayload({}, localData);
    expect(result).toEqual(localData);
  });

  it("merges kpis from apiData", () => {
    const result = mergeStatisticsPayload(
      { kpis: { ...localData.kpis, servicioMasVendido: "Test Service" } },
      localData,
    );
    expect(result.kpis.servicioMasVendido).toBe("Test Service");
  });

  it("merges empleados from apiData when provided", () => {
    const empleados = [{ nombre: "Test", turnos: 5, ingresos: 1000, ocupacion: 50 }];
    const result = mergeStatisticsPayload({ empleados }, localData);
    expect(result.empleados).toEqual(empleados);
  });
});

// ── mapLegacySummaryToStatistics ──

describe("mapLegacySummaryToStatistics", () => {
  const localData = buildDashboardStatistics({
    appointments: [],
    services: [],
    employees: [],
    horarios: [],
    options: { rango: "mes", comparar: "anterior" },
    reference: REFERENCE,
  });

  it("returns localData when no legacy data", () => {
    const result = mapLegacySummaryToStatistics({}, localData);
    expect(result.resumen.turnosHoy.value).toBe(localData.resumen.turnosHoy.value);
  });

  it("maps legacy summary today data", () => {
    const result = mapLegacySummaryToStatistics(
      {
        summary: {
          today: { appointments: 10, variation: 5 },
        },
      },
      localData,
    );
    expect(result.resumen.turnosHoy.value).toBe(10);
    expect(result.resumen.turnosHoy.delta).toBe("+5%");
    expect(result.resumen.turnosHoy.trend).toBe("up");
  });

  it("maps negative variation as down trend", () => {
    const result = mapLegacySummaryToStatistics(
      {
        summary: {
          today: { appointments: 5, variation: -10 },
        },
      },
      localData,
    );
    expect(result.resumen.turnosHoy.trend).toBe("down");
    expect(result.resumen.turnosHoy.delta).toBe("-10%");
  });
});

// ── buildDashboardStatistics ──

describe("buildDashboardStatistics", () => {
  it("returns zero stats for empty data", () => {
    const result = buildDashboardStatistics({
      appointments: [],
      services: [],
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.kpis.ingresoTotal.value).toBe(0);
    expect(result.resumen.turnosPorDia).toHaveLength(7);
    expect(result.asistencia.totalTurnos).toBe(0);
    expect(result.empleados).toHaveLength(0);
  });

  it("counts completed appointments in attendance", () => {
    const appointments = [
      makeTurno({ id_turno: 1, estado: { id_estado: 1, nombre: "Completado", nombre_estado: "Completado" } }),
      makeTurno({ id_turno: 2, estado: { id_estado: 2, nombre: "Cancelado", nombre_estado: "Cancelado" } }),
      makeTurno({ id_turno: 3, estado: { id_estado: 3, nombre: "No Show", nombre_estado: "No Show" } }),
    ];

    const result = buildDashboardStatistics({
      appointments,
      services: [makeService()],
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.asistencia.completados).toBe(1);
    expect(result.asistencia.cancelados).toBe(1);
    expect(result.asistencia.noShow).toBe(1);
  });

  it("calculates service stats correctly", () => {
    const appointments = [
      makeTurno({ id_servicio: 1, estado: { id_estado: 1, nombre: "Confirmado", nombre_estado: "Confirmado" } }),
      makeTurno({ id_turno: 2, id_servicio: 1, estado: { id_estado: 1, nombre: "Confirmado", nombre_estado: "Confirmado" } }),
      makeTurno({ id_turno: 3, id_servicio: 2, estado: { id_estado: 1, nombre: "Confirmado", nombre_estado: "Confirmado" } }),
    ];
    const services = [makeService({ id_servicio: 1, nombre_servicio: "Corte", precio: 1000 }), makeService({ id_servicio: 2, nombre_servicio: "Barba", precio: 500 })];

    const result = buildDashboardStatistics({
      appointments,
      services,
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.servicios.items).toHaveLength(2);
    expect(result.servicios.items[0].solicitados).toBe(2);
    expect(result.servicios.items[0].ingresos).toBe(2000);
    expect(result.servicios.items[1].solicitados).toBe(1);
  });

  it("calculates employee stats for active employees", () => {
    const appointments = [
      makeTurno({ id_empleado: 1, estado: { id_estado: 1, nombre: "Confirmado", nombre_estado: "Confirmado" } }),
      makeTurno({ id_turno: 2, id_empleado: 1, estado: { id_estado: 1, nombre: "Confirmado", nombre_estado: "Confirmado" } }),
    ];

    const result = buildDashboardStatistics({
      appointments,
      services: [makeService()],
      employees: [makeEmployee()],
      horarios: [makeHorario()],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.empleados).toHaveLength(1);
    expect(result.empleados[0].nombre).toBe("María López");
    expect(result.empleados[0].turnos).toBe(2);
  });

  it("filters out inactive employees", () => {
    const result = buildDashboardStatistics({
      appointments: [makeTurno()],
      services: [makeService()],
      employees: [makeEmployee({ activo: false })],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.empleados).toHaveLength(0);
  });

  it("calculates hourly demand", () => {
    const result = buildDashboardStatistics({
      appointments: [makeTurno({ fecha_hora_inicio: "2026-07-20T10:00:00" })],
      services: [makeService()],
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.agenda.horariosDemanda).toHaveLength(12);
    const hour10 = result.agenda.horariosDemanda.find((h) => h.hora === "10:00");
    expect(hour10?.turnos).toBe(1);
  });

  it("returns turnos por dia with 7 days", () => {
    const result = buildDashboardStatistics({
      appointments: [],
      services: [],
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.resumen.turnosPorDia).toHaveLength(7);
    expect(result.resumen.turnosPorDia[0].dia).toBe("Lun");
  });

  it("counts client stats correctly", () => {
    const appointments = [
      makeTurno({ id_cliente: 1, cliente: { nombre: "Ana", apellido: "García", telefono: "" }, estado: { id_estado: 1, nombre: "Completado", nombre_estado: "Completado" } }),
      makeTurno({ id_turno: 2, id_cliente: 2, cliente: { nombre: "Luis", apellido: "Torres", telefono: "" }, estado: { id_estado: 2, nombre: "Cancelado", nombre_estado: "Cancelado" } }),
    ];

    const result = buildDashboardStatistics({
      appointments,
      services: [makeService()],
      employees: [],
      horarios: [],
      options: { rango: "mes", comparar: "anterior" },
      reference: REFERENCE,
    });

    expect(result.clientes.topVisitas.length).toBeGreaterThanOrEqual(1);
    expect(result.clientes.topCancelaciones.length).toBeGreaterThanOrEqual(1);
  });
});
