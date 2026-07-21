import apiClient, { ApiError } from "@/lib/api-client";
import { empleadoService } from "@/services/empleado.service";
import { horarioService } from "@/services/horario.service";
import { servicioService } from "@/services/servicio.service";
import type { ApiTurno } from "@/types/api";
import type {
  DashboardStatistics,
  StatisticsQueryOptions,
} from "@/types/statistics";
import {
  buildDashboardStatistics,
  getStatisticsComparisonRange,
  getStatisticsPeriodRange,
  isPartialStatisticsPayload,
  mapLegacySummaryToStatistics,
  mergeStatisticsPayload,
} from "@/lib/statistics-utils";
import { buildLocalDateTimeString } from "@/lib/datetime-utils";
import { appointmentService } from "@/features/booking/services/appointment.service";

async function fetchAppointmentsForAnalysis(
  businessId: number | string,
  options: StatisticsQueryOptions,
): Promise<ApiTurno[]> {
  const now = new Date();
  const currentRange = getStatisticsPeriodRange(options.rango, now);
  const comparisonRange = getStatisticsComparisonRange(
    options.rango,
    options.comparar,
    now,
  );

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);
  const monthTrendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const desde = [
    currentRange.desde,
    comparisonRange.desde,
    getStatisticsPeriodRange("mes", now).desde,
    getStatisticsComparisonRange("mes", "anterior", now).desde,
  ]
    .map((value) => new Date(value).getTime())
    .concat(monthTrendStart.getTime(), yearStart.getTime())
    .sort((a, b) => a - b)[0];

  const hasta = [
    currentRange.hasta,
    comparisonRange.hasta,
    getStatisticsPeriodRange("mes", now).hasta,
    getStatisticsComparisonRange("mes", "anterior", now).hasta,
  ]
    .map((value) => new Date(value).getTime())
    .concat(yearEnd.getTime())
    .sort((a, b) => b - a)[0];

  return appointmentService.getAppointmentsByRange({
    id_negocio: businessId,
    desde: buildLocalDateTimeString(new Date(desde), "00:00"),
    hasta: buildLocalDateTimeString(new Date(hasta), "23:59"),
  });
}

async function buildLocalStatistics(
  businessId: number | string,
  options: StatisticsQueryOptions,
): Promise<DashboardStatistics> {
  const [appointments, services, employees, horarios] = await Promise.all([
    fetchAppointmentsForAnalysis(businessId, options),
    servicioService.getByBusiness(businessId, { includeInactive: true }),
    empleadoService.getByBusiness(businessId),
    horarioService.getByBusiness(businessId),
  ]);

  return buildDashboardStatistics({
    appointments,
    services,
    employees,
    horarios,
    options,
  });
}

export const estadisticaService = {
  getByBusiness: async (
    businessId: number | string,
    options: StatisticsQueryOptions,
  ): Promise<DashboardStatistics> => {
    const localStatistics = await buildLocalStatistics(businessId, options);

    try {
      const now = new Date();
      const range = getStatisticsPeriodRange(options.rango, now);
      const dateStart = range.desde.split(" ")[0];
      const dateEnd = range.hasta.split(" ")[0];

      const apiData = await apiClient.get<unknown>(
        `/statistics/business/${businessId}`,
        {
          date_start: dateStart,
          date_end: dateEnd,
        },
      );

      if (!isPartialStatisticsPayload(apiData)) {
        return localStatistics;
      }

      if ("summary" in apiData && !("kpis" in apiData)) {
        return mapLegacySummaryToStatistics(
          apiData as Parameters<typeof mapLegacySummaryToStatistics>[0],
          localStatistics,
        );
      }

      return mergeStatisticsPayload(
        apiData as Partial<DashboardStatistics>,
        localStatistics,
      );
    } catch (error) {
      if (error instanceof ApiError && [404, 405, 501].includes(error.status)) {
        return localStatistics;
      }

      throw error;
    }
  },
};

export default estadisticaService;
