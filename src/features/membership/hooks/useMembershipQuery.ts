import { useQuery } from "@tanstack/react-query";
import { membershipService } from "@/features/membership/services/membership.service";
import type { ApiPlan, ApiNegocioFunciones, ApiSuscripcion } from "@/types/api";

export const usePlanes = () =>
  useQuery<ApiPlan[], Error>({
    queryKey: ["planes"],
    queryFn: () => membershipService.listarPlanes(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useFuncionesNegocio = (idNegocio: number | null) =>
  useQuery<ApiNegocioFunciones | null, Error>({
    queryKey: ["funciones-negocio", idNegocio],
    queryFn: () => {
      if (!idNegocio) return null;
      return membershipService.obtenerFuncionesNegocio(idNegocio);
    },
    enabled: idNegocio != null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useSuscripcionActual = () =>
  useQuery<ApiSuscripcion | null, Error>({
    queryKey: ["suscripcion-actual"],
    queryFn: () => membershipService.obtenerSuscripcionActual(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
