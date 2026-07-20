export type StatisticsRange = "hoy" | "semana" | "mes" | "anio";
export type StatisticsCompare = "anterior" | "anio";

export type TabValue =
  | "resumen"
  | "clientes"
  | "servicios"
  | "ingresos"
  | "agenda"
  | "asistencia"
  | "empleados";

export interface StatisticsQueryOptions {
  rango: StatisticsRange;
  comparar: StatisticsCompare;
}

export interface MetricWithDelta {
  value: number;
  delta?: string;
  trend?: "up" | "down";
}

export interface DailyComparisonItem {
  dia: string;
  actual: number;
  anterior: number;
}

export interface ServiceStatItem {
  nombre: string;
  solicitados: number;
  ingresos: number;
  tiempo: number;
}

export interface ClientVisitItem {
  nombre: string;
  visitas: number;
  cancelaciones: number;
}

export interface ClientCancellationItem {
  nombre: string;
  cancelaciones: number;
}

export interface HourlyDemandItem {
  hora: string;
  turnos: number;
}

export interface AttendanceSlice {
  name: string;
  value: number;
}

export interface EmployeeStatItem {
  nombre: string;
  turnos: number;
  ingresos: number;
  ocupacion: number;
}

export interface MonthlyIncomeItem {
  mes: string;
  ingresos: number;
}

export interface DashboardStatistics {
  kpis: {
    ingresoTotal: MetricWithDelta;
    clientesActivos: MetricWithDelta;
    servicioMasVendido: string;
    diaMasFacturado: string;
    horaMayorDemanda: string;
    ocupacionAgenda: MetricWithDelta;
  };
  resumen: {
    turnosHoy: MetricWithDelta;
    turnosSemana: MetricWithDelta;
    turnosMes: MetricWithDelta;
    turnosPorDia: DailyComparisonItem[];
  };
  clientes: {
    nuevos: MetricWithDelta;
    recurrentes: MetricWithDelta;
    inactivos: MetricWithDelta;
    topVisitas: ClientVisitItem[];
    topCancelaciones: ClientCancellationItem[];
  };
  servicios: {
    items: ServiceStatItem[];
    menosSolicitado: string | null;
  };
  ingresos: {
    facturacionDiaria: MetricWithDelta;
    facturacionSemanal: MetricWithDelta;
    facturacionMensual: MetricWithDelta;
    ticketPromedio: MetricWithDelta;
    evolucionMensual: MonthlyIncomeItem[];
  };
  agenda: {
    horariosDemanda: HourlyDemandItem[];
    horarioPico: string;
    diaMasTurnos: string;
    menorOcupacion: string;
    ocupacionPorcentaje: number;
  };
  asistencia: {
    completados: number;
    cancelados: number;
    reprogramados: number;
    noShow: number;
    distribucion: AttendanceSlice[];
    tasaAsistencia: number;
    totalTurnos: number;
  };
  empleados: EmployeeStatItem[];
}
