import type {
  ApiEmpleado,
  ApiHorario,
  ApiServicio,
  ApiTurno,
} from "@/types/api";
import type {
  DashboardStatistics,
  MetricWithDelta,
  StatisticsCompare,
  StatisticsQueryOptions,
  StatisticsRange,
} from "@/types/statistics";
import {
  buildLocalDateTimeString,
  getLocalDayRange,
  getLocalWeekRange,
  type DateTimeRange,
} from "@/lib/datetime-utils";
import { WEEK_DAYS } from "@/lib/schedule-utils";

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;
const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

const REVENUE_STATUSES = new Set(["completed", "confirmed"]);
const CANCELLED_STATUS = "cancelled";
const RESCHEDULED_STATUS = "rescheduled";
const NO_SHOW_STATUS = "no_show";

export function getStatisticsPeriodRange(
  rango: StatisticsRange,
  reference = new Date(),
): DateTimeRange {
  switch (rango) {
    case "hoy":
      return getLocalDayRange(reference);
    case "semana":
      return getLocalWeekRange(reference);
    case "mes": {
      const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
      const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
      return {
        desde: buildLocalDateTimeString(start, "00:00"),
        hasta: buildLocalDateTimeString(end, "23:59"),
      };
    }
    case "anio": {
      const start = new Date(reference.getFullYear(), 0, 1);
      const end = new Date(reference.getFullYear(), 11, 31);
      return {
        desde: buildLocalDateTimeString(start, "00:00"),
        hasta: buildLocalDateTimeString(end, "23:59"),
      };
    }
  }
}

export function getStatisticsComparisonRange(
  rango: StatisticsRange,
  comparar: StatisticsCompare,
  reference = new Date(),
): DateTimeRange {
  if (comparar === "anio") {
    const previousYear = new Date(reference);
    previousYear.setFullYear(previousYear.getFullYear() - 1);
    return getStatisticsPeriodRange(rango, previousYear);
  }

  switch (rango) {
    case "hoy": {
      const previous = new Date(reference);
      previous.setDate(previous.getDate() - 1);
      return getLocalDayRange(previous);
    }
    case "semana": {
      const previous = new Date(reference);
      previous.setDate(previous.getDate() - 7);
      return getLocalWeekRange(previous);
    }
    case "mes": {
      const previous = new Date(reference.getFullYear(), reference.getMonth() - 1, 1);
      return getStatisticsPeriodRange("mes", previous);
    }
    case "anio": {
      const previous = new Date(reference.getFullYear() - 1, 0, 1);
      return getStatisticsPeriodRange("anio", previous);
    }
  }
}

function calcDelta(current: number, previous: number): MetricWithDelta {
  const value = current;

  if (previous === 0) {
    if (current === 0) {
      return { value: 0 };
    }

    return { value, delta: "+100%", trend: "up" };
  }

  const pct = Math.round(((current - previous) / previous) * 100);

  return {
    value,
    delta: `${pct >= 0 ? "+" : ""}${pct}%`,
    trend: pct >= 0 ? "up" : "down",
  };
}

function classifyStatus(appointment: ApiTurno) {
  const status = (
    appointment.estado?.nombre ??
    appointment.estado?.nombre_estado ??
    ""
  ).toLowerCase();

  if (status.includes("cancel")) {
    return CANCELLED_STATUS;
  }

  if (status.includes("reprogram") || status.includes("reagend")) {
    return RESCHEDULED_STATUS;
  }

  if (
    status.includes("no show") ||
    status.includes("no-show") ||
    status.includes("ausent") ||
    status.includes("inasist")
  ) {
    return NO_SHOW_STATUS;
  }

  if (
    status.includes("complet") ||
    status.includes("confirm") ||
    status.includes("finaliz") ||
    status.includes("atend")
  ) {
    return "completed";
  }

  if (status.includes("pend")) {
    return "confirmed";
  }

  return "other";
}

function getClientName(appointment: ApiTurno) {
  const name = [appointment.cliente?.nombre, appointment.cliente?.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || `Cliente #${appointment.id_cliente}`;
}

function getServiceId(appointment: ApiTurno): number | undefined {
  return appointment.servicio?.id_servicio ?? appointment.id_servicio;
}

function getServicePrice(
  appointment: ApiTurno,
  servicesById: Map<number, ApiServicio>,
) {
  const sid = getServiceId(appointment);
  return sid != null ? (servicesById.get(sid)?.precio ?? 0) : 0;
}

function getServiceDuration(
  appointment: ApiTurno,
  servicesById: Map<number, ApiServicio>,
) {
  const sid = getServiceId(appointment);
  if (sid == null) return 30;
  const service = servicesById.get(sid);
  if (!service) {
    return 30;
  }

  return Math.round((service.duracion_min + service.duracion_max) / 2);
}

function isWithinRange(isoDate: string, range: DateTimeRange) {
  const time = new Date(isoDate).getTime();
  return (
    time >= new Date(range.desde).getTime() &&
    time <= new Date(range.hasta).getTime()
  );
}

function filterAppointmentsInRange(
  appointments: ApiTurno[],
  range: DateTimeRange,
) {
  return appointments.filter((appointment) =>
    isWithinRange(appointment.fecha_hora_inicio, range),
  );
}

function sumRevenue(
  appointments: ApiTurno[],
  servicesById: Map<number, ApiServicio>,
) {
  return appointments.reduce((total, appointment) => {
    const status = classifyStatus(appointment);
    if (!REVENUE_STATUSES.has(status)) {
      return total;
    }

    return total + getServicePrice(appointment, servicesById);
  }, 0);
}

function countByWeekday(appointments: ApiTurno[]) {
  const counts = Array.from({ length: 7 }, () => 0);

  appointments.forEach((appointment) => {
    const date = new Date(appointment.fecha_hora_inicio);
    const jsDay = date.getDay();
    const index = jsDay === 0 ? 6 : jsDay - 1;
    counts[index] += 1;
  });

  return counts;
}

function getWeekdayNameFromIndex(index: number) {
  return WEEK_DAYS[index] ?? DAY_LABELS[index];
}

function getHourLabel(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:00`;
}

function estimateOpenMinutes(horarios: ApiHorario[], daysInPeriod: number) {
  if (!horarios.length) {
    return Math.max(daysInPeriod * 8 * 60, 1);
  }

  const openMinutesPerWeek = horarios.reduce((total, horario) => {
    const [startHour, startMinute] = horario.hora_apertura
      .slice(0, 5)
      .split(":")
      .map(Number);
    const [endHour, endMinute] = horario.hora_cierre
      .slice(0, 5)
      .split(":")
      .map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    return total + Math.max(end - start, 0);
  }, 0);

  const weeks = Math.max(daysInPeriod / 7, 1);
  return Math.max(openMinutesPerWeek * weeks, 1);
}

function estimateBookedMinutes(
  appointments: ApiTurno[],
  servicesById: Map<number, ApiServicio>,
) {
  return appointments.reduce((total, appointment) => {
    if (classifyStatus(appointment) === CANCELLED_STATUS) {
      return total;
    }

    if (appointment.fecha_hora_fin) {
      const start = new Date(appointment.fecha_hora_inicio).getTime();
      const end = new Date(appointment.fecha_hora_fin).getTime();
      return total + Math.max((end - start) / 60_000, 0);
    }

    return total + getServiceDuration(appointment, servicesById);
  }, 0);
}

function getDaysInRange(range: DateTimeRange) {
  const start = new Date(range.desde);
  const end = new Date(range.hasta);
  const diff = end.getTime() - start.getTime();
  return Math.max(Math.ceil(diff / (24 * 60 * 60 * 1000)), 1);
}

function buildMonthlyIncomeTrend(
  appointments: ApiTurno[],
  servicesById: Map<number, ApiServicio>,
  reference = new Date(),
) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(reference.getFullYear(), reference.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      mes: MONTH_LABELS[date.getMonth()],
      ingresos: 0,
    };
  });

  appointments.forEach((appointment) => {
    const date = new Date(appointment.fecha_hora_inicio);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = months.find((item) => item.key === key);

    if (!month) {
      return;
    }

    if (REVENUE_STATUSES.has(classifyStatus(appointment))) {
      month.ingresos += getServicePrice(appointment, servicesById);
    }
  });

  return months.map(({ mes, ingresos }) => ({ mes, ingresos }));
}

function buildHourlyDemand(appointments: ApiTurno[]) {
  const counts = new Map<string, number>();

  appointments.forEach((appointment) => {
    const hour = getHourLabel(new Date(appointment.fecha_hora_inicio));
    counts.set(hour, (counts.get(hour) ?? 0) + 1);
  });

  const hours = Array.from({ length: 12 }, (_, index) => {
    const hour = `${String(index + 9).padStart(2, "0")}:00`;
    return { hora: hour, turnos: counts.get(hour) ?? 0 };
  });

  return hours;
}

function getPeakHourRange(appointments: ApiTurno[]) {
  const demand = buildHourlyDemand(appointments);
  const peak = demand.reduce(
    (best, current) => (current.turnos > best.turnos ? current : best),
    demand[0] ?? { hora: "—", turnos: 0 },
  );

  if (peak.turnos === 0) {
    return "—";
  }

  const hour = Number(peak.hora.slice(0, 2));
  return `${peak.hora} - ${String(hour + 1).padStart(2, "0")}:00`;
}

function getLowestDemandHour(appointments: ApiTurno[]) {
  const demand = buildHourlyDemand(appointments).filter((item) => item.turnos >= 0);
  const lowest = demand.reduce(
    (best, current) => (current.turnos < best.turnos ? current : best),
    demand[0] ?? { hora: "—", turnos: 0 },
  );

  if (lowest.turnos === 0 && demand.every((item) => item.turnos === 0)) {
    return "—";
  }

  const hour = Number(lowest.hora.slice(0, 2));
  return `${lowest.hora} - ${String(hour + 1).padStart(2, "0")}:00`;
}

function getBusiestDayName(appointments: ApiTurno[]) {
  const counts = countByWeekday(appointments);
  const max = Math.max(...counts, 0);

  if (max === 0) {
    return "—";
  }

  const index = counts.findIndex((count) => count === max);
  return getWeekdayNameFromIndex(index);
}

function buildClientStats(appointments: ApiTurno[]) {
  const visits = new Map<
    string,
    { visitas: number; cancelaciones: number; dates: Set<string> }
  >();

  appointments.forEach((appointment) => {
    const name = getClientName(appointment);
    const current = visits.get(name) ?? {
      visitas: 0,
      cancelaciones: 0,
      dates: new Set<string>(),
    };

    const status = classifyStatus(appointment);
    const dateKey = appointment.fecha_hora_inicio.slice(0, 10);

    if (status === CANCELLED_STATUS) {
      current.cancelaciones += 1;
    } else if (status !== NO_SHOW_STATUS) {
      current.visitas += 1;
      current.dates.add(dateKey);
    }

    visits.set(name, current);
  });

  const entries = Array.from(visits.entries()).map(([nombre, data]) => ({
    nombre,
    visitas: data.visitas,
    cancelaciones: data.cancelaciones,
    uniqueDays: data.dates.size,
  }));

  const topVisitas = [...entries]
    .sort((a, b) => b.visitas - a.visitas)
    .slice(0, 5)
    .map(({ nombre, visitas, cancelaciones }) => ({
      nombre,
      visitas,
      cancelaciones,
    }));

  const topCancelaciones = [...entries]
    .filter((item) => item.cancelaciones > 0)
    .sort((a, b) => b.cancelaciones - a.cancelaciones)
    .slice(0, 5)
    .map(({ nombre, cancelaciones }) => ({ nombre, cancelaciones }));

  const activeClients = entries.filter((item) => item.visitas > 0).length;
  const recurringClients = entries.filter((item) => item.uniqueDays > 1).length;
  const newClients = entries.filter((item) => item.visitas === 1).length;
  const inactiveClients = entries.filter(
    (item) => item.visitas === 0 && item.cancelaciones > 0,
  ).length;

  return {
    activeClients,
    recurringClients,
    newClients,
    inactiveClients,
    topVisitas,
    topCancelaciones,
  };
}

function buildServiceStats(
  appointments: ApiTurno[],
  services: ApiServicio[],
  comparisonAppointments: ApiTurno[],
) {
  const servicesById = new Map(services.map((service) => [service.id_servicio, service]));
  const counts = new Map<number, { solicitados: number; ingresos: number }>();

  appointments.forEach((appointment) => {
    const sid = getServiceId(appointment);
    if (sid == null) return;

    const current = counts.get(sid) ?? {
      solicitados: 0,
      ingresos: 0,
    };

    current.solicitados += 1;

    if (REVENUE_STATUSES.has(classifyStatus(appointment))) {
      current.ingresos += getServicePrice(appointment, servicesById);
    }

    counts.set(sid, current);
  });

  const items = services
    .map((service) => {
      const stats = counts.get(service.id_servicio) ?? {
        solicitados: 0,
        ingresos: 0,
      };

      return {
        nombre: service.nombre_servicio,
        solicitados: stats.solicitados,
        ingresos: stats.ingresos,
        tiempo: Math.round((service.duracion_min + service.duracion_max) / 2),
      };
    })
    .filter((item) => item.solicitados > 0 || services.length <= 8)
    .sort((a, b) => b.solicitados - a.solicitados);

  const previousCounts = new Map<number, number>();
  comparisonAppointments.forEach((appointment) => {
    const sid = getServiceId(appointment);
    if (sid == null) return;
    previousCounts.set(
      sid,
      (previousCounts.get(sid) ?? 0) + 1,
    );
  });

  const sorted = [...items].sort((a, b) => a.solicitados - b.solicitados);
  const leastRequested = sorted.find((item) => item.solicitados > 0) ?? sorted[0];

  return {
    items,
    menosSolicitado: leastRequested?.nombre ?? null,
    topService: items[0]?.nombre ?? "—",
    previousTopCount: previousCounts.size,
  };
}

function buildEmployeeStats(
  appointments: ApiTurno[],
  employees: ApiEmpleado[],
  servicesById: Map<number, ApiServicio>,
  openMinutes: number,
) {
  const activeEmployees = employees.filter((employee) => employee.activo);
  const employeeCount = Math.max(activeEmployees.length, 1);
  const capacityMinutes = openMinutes / employeeCount;

  return activeEmployees.map((employee) => {
    const employeeAppointments = appointments.filter(
      (appointment) => (appointment.empleado?.id_empleado ?? appointment.id_empleado) === employee.id_empleado,
    );

    const turnos = employeeAppointments.length;
    const ingresos = sumRevenue(employeeAppointments, servicesById);
    const bookedMinutes = estimateBookedMinutes(employeeAppointments, servicesById);
    const ocupacion = Math.min(
      100,
      Math.round((bookedMinutes / Math.max(capacityMinutes, 1)) * 100),
    );

    return {
      nombre: `${employee.nombre} ${employee.apellido}`.trim(),
      turnos,
      ingresos,
      ocupacion,
    };
  });
}

function buildAttendanceStats(appointments: ApiTurno[]) {
  let completados = 0;
  let cancelados = 0;
  let reprogramados = 0;
  let noShow = 0;

  appointments.forEach((appointment) => {
    const status = classifyStatus(appointment);

    switch (status) {
      case "completed":
      case "confirmed":
        completados += 1;
        break;
      case CANCELLED_STATUS:
        cancelados += 1;
        break;
      case RESCHEDULED_STATUS:
        reprogramados += 1;
        break;
      case NO_SHOW_STATUS:
        noShow += 1;
        break;
      default:
        completados += 1;
        break;
    }
  });

  const totalTurnos = completados + cancelados + reprogramados + noShow;
  const attended = completados;
  const tasaAsistencia =
    totalTurnos === 0 ? 0 : Math.round((attended / totalTurnos) * 100);

  return {
    completados,
    cancelados,
    reprogramados,
    noShow,
    totalTurnos,
    tasaAsistencia,
    distribucion: [
      { name: "Completados", value: completados },
      { name: "Cancelados", value: cancelados },
      { name: "Reprogramados", value: reprogramados },
      { name: "No show", value: noShow },
    ].filter((item) => item.value > 0),
  };
}

export function buildDashboardStatistics(input: {
  appointments: ApiTurno[];
  services: ApiServicio[];
  employees: ApiEmpleado[];
  horarios: ApiHorario[];
  options: StatisticsQueryOptions;
  reference?: Date;
}): DashboardStatistics {
  const reference = input.reference ?? new Date();
  const servicesById = new Map(
    input.services.map((service) => [service.id_servicio, service]),
  );

  const periodRange = getStatisticsPeriodRange(input.options.rango, reference);
  const comparisonRange = getStatisticsComparisonRange(
    input.options.rango,
    input.options.comparar,
    reference,
  );

  const todayRange = getLocalDayRange(reference);
  const weekRange = getLocalWeekRange(reference);
  const monthRange = getStatisticsPeriodRange("mes", reference);
  const yesterdayRange = getStatisticsComparisonRange("hoy", "anterior", reference);
  const previousWeekRange = getStatisticsComparisonRange(
    "semana",
    "anterior",
    reference,
  );
  const previousMonthRange = getStatisticsComparisonRange(
    "mes",
    "anterior",
    reference,
  );

  const periodAppointments = filterAppointmentsInRange(
    input.appointments,
    periodRange,
  );
  const comparisonAppointments = filterAppointmentsInRange(
    input.appointments,
    comparisonRange,
  );

  const todayAppointments = filterAppointmentsInRange(
    input.appointments,
    todayRange,
  );
  const yesterdayAppointments = filterAppointmentsInRange(
    input.appointments,
    yesterdayRange,
  );
  const weekAppointments = filterAppointmentsInRange(
    input.appointments,
    weekRange,
  );
  const previousWeekAppointments = filterAppointmentsInRange(
    input.appointments,
    previousWeekRange,
  );
  const monthAppointments = filterAppointmentsInRange(
    input.appointments,
    monthRange,
  );
  const previousMonthAppointments = filterAppointmentsInRange(
    input.appointments,
    previousMonthRange,
  );

  const totalIncome = sumRevenue(periodAppointments, servicesById);
  const previousIncome = sumRevenue(comparisonAppointments, servicesById);

  const clientStats = buildClientStats(periodAppointments);
  const previousClientStats = buildClientStats(comparisonAppointments);
  const serviceStats = buildServiceStats(
    periodAppointments,
    input.services,
    comparisonAppointments,
  );

  const daysInPeriod = getDaysInRange(periodRange);
  const openMinutes = estimateOpenMinutes(input.horarios, daysInPeriod);
  const bookedMinutes = estimateBookedMinutes(periodAppointments, servicesById);
  const previousBookedMinutes = estimateBookedMinutes(
    comparisonAppointments,
    servicesById,
  );
  const occupancyRate = Math.min(
    100,
    Math.round((bookedMinutes / openMinutes) * 100),
  );
  const previousOccupancyRate = Math.min(
    100,
    Math.round((previousBookedMinutes / openMinutes) * 100),
  );

  const weekdayCurrent = countByWeekday(periodAppointments);
  const weekdayPrevious = countByWeekday(comparisonAppointments);
  const attendance = buildAttendanceStats(periodAppointments);

  const dailyIncome = sumRevenue(todayAppointments, servicesById);
  const previousDailyIncome = sumRevenue(yesterdayAppointments, servicesById);
  const weeklyIncome = sumRevenue(weekAppointments, servicesById);
  const previousWeeklyIncome = sumRevenue(previousWeekAppointments, servicesById);
  const monthlyIncome = sumRevenue(monthAppointments, servicesById);
  const previousMonthlyIncome = sumRevenue(previousMonthAppointments, servicesById);

  const revenueAppointments = periodAppointments.filter((appointment) =>
    REVENUE_STATUSES.has(classifyStatus(appointment)),
  );
  const previousRevenueAppointments = comparisonAppointments.filter((appointment) =>
    REVENUE_STATUSES.has(classifyStatus(appointment)),
  );

  const averageTicket =
    revenueAppointments.length === 0
      ? 0
      : Math.round(totalIncome / revenueAppointments.length);
  const previousAverageTicket =
    previousRevenueAppointments.length === 0
      ? 0
      : Math.round(previousIncome / previousRevenueAppointments.length);

  const incomeByWeekday = DAY_LABELS.map((_, index) => {
    const dayAppointments = periodAppointments.filter((appointment) => {
      const date = new Date(appointment.fecha_hora_inicio);
      const jsDay = date.getDay();
      const weekdayIndex = jsDay === 0 ? 6 : jsDay - 1;
      return weekdayIndex === index;
    });

    return {
      index,
      income: sumRevenue(dayAppointments, servicesById),
    };
  });

  const topBillingDayIndex = incomeByWeekday.reduce(
    (best, current) => (current.income > best.income ? current : best),
    incomeByWeekday[0] ?? { index: 0, income: 0 },
  ).index;

  return {
    kpis: {
      ingresoTotal: calcDelta(totalIncome, previousIncome),
      clientesActivos: calcDelta(
        clientStats.activeClients,
        previousClientStats.activeClients,
      ),
      servicioMasVendido: serviceStats.topService,
      diaMasFacturado: getWeekdayNameFromIndex(topBillingDayIndex),
      horaMayorDemanda: getPeakHourRange(periodAppointments).split(" - ")[0] ?? "—",
      ocupacionAgenda: calcDelta(occupancyRate, previousOccupancyRate),
    },
    resumen: {
      turnosHoy: calcDelta(todayAppointments.length, yesterdayAppointments.length),
      turnosSemana: calcDelta(
        weekAppointments.length,
        previousWeekAppointments.length,
      ),
      turnosMes: calcDelta(
        monthAppointments.length,
        previousMonthAppointments.length,
      ),
      turnosPorDia: DAY_LABELS.map((dia, index) => ({
        dia,
        actual: weekdayCurrent[index] ?? 0,
        anterior: weekdayPrevious[index] ?? 0,
      })),
    },
    clientes: {
      nuevos: calcDelta(clientStats.newClients, previousClientStats.newClients),
      recurrentes: calcDelta(
        clientStats.recurringClients,
        previousClientStats.recurringClients,
      ),
      inactivos: calcDelta(
        clientStats.inactiveClients,
        previousClientStats.inactiveClients,
      ),
      topVisitas: clientStats.topVisitas,
      topCancelaciones: clientStats.topCancelaciones,
    },
    servicios: {
      items: serviceStats.items,
      menosSolicitado: serviceStats.menosSolicitado,
    },
    ingresos: {
      facturacionDiaria: calcDelta(dailyIncome, previousDailyIncome),
      facturacionSemanal: calcDelta(weeklyIncome, previousWeeklyIncome),
      facturacionMensual: calcDelta(monthlyIncome, previousMonthlyIncome),
      ticketPromedio: calcDelta(averageTicket, previousAverageTicket),
      evolucionMensual: buildMonthlyIncomeTrend(
        input.appointments,
        servicesById,
        reference,
      ),
    },
    agenda: {
      horariosDemanda: buildHourlyDemand(periodAppointments),
      horarioPico: getPeakHourRange(periodAppointments),
      diaMasTurnos: getBusiestDayName(periodAppointments),
      menorOcupacion: getLowestDemandHour(periodAppointments),
      ocupacionPorcentaje: occupancyRate,
    },
    asistencia: attendance,
    empleados: buildEmployeeStats(
      periodAppointments,
      input.employees,
      servicesById,
      openMinutes,
    ),
  };
}

export function exportStatisticsFile(
  statistics: DashboardStatistics,
  format: "csv" | "excel",
) {
  const lines = [
    "Sección,Métrica,Valor",
    `KPIs,Ingreso total,${statistics.kpis.ingresoTotal.value}`,
    `KPIs,Clientes activos,${statistics.kpis.clientesActivos.value}`,
    `KPIs,Servicio más vendido,${statistics.kpis.servicioMasVendido}`,
    `KPIs,Día más facturado,${statistics.kpis.diaMasFacturado}`,
    `KPIs,Hora de mayor demanda,${statistics.kpis.horaMayorDemanda}`,
    `KPIs,Ocupación de agenda,${statistics.kpis.ocupacionAgenda.value}%`,
    `Asistencia,Completados,${statistics.asistencia.completados}`,
    `Asistencia,Cancelados,${statistics.asistencia.cancelados}`,
    `Asistencia,Reprogramados,${statistics.asistencia.reprogramados}`,
    `Asistencia,No show,${statistics.asistencia.noShow}`,
    ...statistics.servicios.items.map(
      (service) =>
        `Servicios,${service.nombre},${service.solicitados} solicitudes / $${service.ingresos}`,
    ),
    ...statistics.empleados.map(
      (employee) =>
        `Empleados,${employee.nombre},${employee.turnos} turnos / $${employee.ingresos}`,
    ),
  ];

  const blob = new Blob([lines.join("\n")], {
    type:
      format === "csv"
        ? "text/csv;charset=utf-8;"
        : "application/vnd.ms-excel;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `estadisticas-turnogo.${format === "csv" ? "csv" : "xls"}`;
  link.click();
  URL.revokeObjectURL(url);
}

export function isPartialStatisticsPayload(
  payload: unknown,
): payload is Partial<DashboardStatistics> {
  return payload != null && typeof payload === "object";
}

export function mergeStatisticsPayload(
  apiData: Partial<DashboardStatistics>,
  localData: DashboardStatistics,
): DashboardStatistics {
  return {
    ...localData,
    ...apiData,
    kpis: { ...localData.kpis, ...apiData.kpis },
    resumen: { ...localData.resumen, ...apiData.resumen },
    clientes: { ...localData.clientes, ...apiData.clientes },
    servicios: { ...localData.servicios, ...apiData.servicios },
    ingresos: { ...localData.ingresos, ...apiData.ingresos },
    agenda: { ...localData.agenda, ...apiData.agenda },
    asistencia: { ...localData.asistencia, ...apiData.asistencia },
    empleados: apiData.empleados?.length ? apiData.empleados : localData.empleados,
  };
}

export function mapLegacySummaryToStatistics(
  legacy: {
    summary?: {
      today?: { appointments?: number; variation?: number };
      week?: { appointments?: number; variation?: number };
      month?: { appointments?: number; variation?: number };
      chart?: Array<{ label?: string; current?: number; previous?: number }>;
    };
  },
  localData: DashboardStatistics,
): DashboardStatistics {
  const chart = legacy.summary?.chart ?? [];

  return mergeStatisticsPayload(
    {
      resumen: {
        turnosHoy: {
          value: legacy.summary?.today?.appointments ?? localData.resumen.turnosHoy.value,
          delta:
            legacy.summary?.today?.variation != null
              ? `${legacy.summary.today.variation >= 0 ? "+" : ""}${legacy.summary.today.variation}%`
              : localData.resumen.turnosHoy.delta,
          trend:
            legacy.summary?.today?.variation != null
              ? legacy.summary.today.variation >= 0
                ? "up"
                : "down"
              : localData.resumen.turnosHoy.trend,
        },
        turnosSemana: {
          value: legacy.summary?.week?.appointments ?? localData.resumen.turnosSemana.value,
          delta:
            legacy.summary?.week?.variation != null
              ? `${legacy.summary.week.variation >= 0 ? "+" : ""}${legacy.summary.week.variation}%`
              : localData.resumen.turnosSemana.delta,
          trend:
            legacy.summary?.week?.variation != null
              ? legacy.summary.week.variation >= 0
                ? "up"
                : "down"
              : localData.resumen.turnosSemana.trend,
        },
        turnosMes: {
          value: legacy.summary?.month?.appointments ?? localData.resumen.turnosMes.value,
          delta:
            legacy.summary?.month?.variation != null
              ? `${legacy.summary.month.variation >= 0 ? "+" : ""}${legacy.summary.month.variation}%`
              : localData.resumen.turnosMes.delta,
          trend:
            legacy.summary?.month?.variation != null
              ? legacy.summary.month.variation >= 0
                ? "up"
                : "down"
              : localData.resumen.turnosMes.trend,
        },
        turnosPorDia: chart.length
          ? chart.map((item) => ({
              dia: item.label ?? "—",
              actual: item.current ?? 0,
              anterior: item.previous ?? 0,
            }))
          : localData.resumen.turnosPorDia,
      },
    },
    localData,
  );
}
