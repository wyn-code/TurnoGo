import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import type { ApiCategoryTop } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

/** Las categorías con más negocios activos (GET /categorias/top), sin las vacías. */
export const useTopCategories = (limit = 5) =>
  useQuery<ApiCategoryTop[], Error>({
    queryKey: queryKeys.categories.top(limit),
    queryFn: () => businessService.getTopCategories(limit),
    staleTime: 5 * 60 * 1000,
  });

export default useTopCategories;
