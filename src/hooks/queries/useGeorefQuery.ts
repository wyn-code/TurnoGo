import { useQuery } from "@tanstack/react-query";

import { georefService } from "@/services/georef.service";
import type { ApiProvincia, ApiLocalidad } from "@/types/api";

export const useProvincias = () =>
  useQuery<ApiProvincia[], Error>({
    queryKey: ["provincias"],
    queryFn: georefService.getProvincias,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const useLocalidades = (idProvincia: number | null | undefined) =>
  useQuery<ApiLocalidad[], Error>({
    queryKey: ["localidades", idProvincia],
    queryFn: () => georefService.getLocalidades(idProvincia!),
    enabled: idProvincia != null,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
