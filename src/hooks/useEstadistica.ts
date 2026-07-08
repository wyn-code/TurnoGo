import { useQuery } from "@tanstack/react-query";
import { estadisticaService } from "@/services/estadistica.service";
import type {
  StatisticsCompare,
  StatisticsRange,
} from "@/types/statistics";

export const useStatistics = (
  businessId?: number | string,
  rango: StatisticsRange = "mes",
  comparar: StatisticsCompare = "anterior",
) => {
  return useQuery({
    queryKey: ["statistics", businessId, rango, comparar],
    queryFn: () =>
      estadisticaService.getByBusiness(businessId!, { rango, comparar }),
    enabled: businessId != null,
    staleTime: 60 * 1000,
  });
};

export default useStatistics;
