import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import type { ApiCategoryTree } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

/** Categorías jerárquicas (GET /categorias/tree). Cambian poco: cache de 10 min. */
export const useCategoriesTree = () =>
  useQuery<ApiCategoryTree[], Error>({
    queryKey: queryKeys.categories.tree(),
    queryFn: businessService.getCategoriesTree,
    staleTime: 10 * 60 * 1000,
  });

export default useCategoriesTree;
