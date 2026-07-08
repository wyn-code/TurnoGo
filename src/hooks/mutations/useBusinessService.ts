import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import businessService from "@/services/business.service";
import type { ApiNegocio } from "@/types/api";

export type BusinessConfigChanges = {
  nombre?: string;
  telefono?: string | null;
  wsp?: string;
  ig_url?: string | null;
  direccion?: string;
  ciudad?: string;
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      business,
      changes,
    }: {
      business: ApiNegocio;
      changes: BusinessConfigChanges;
    }) =>
      businessService.updateBusiness(
        business.id_negocio,
        business,
        changes,
      ),

    onSuccess: (updatedBusiness) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["my-business"] });
      queryClient.setQueryData(
        ["my-business", updatedBusiness.usuario_id],
        updatedBusiness,
      );
      if (updatedBusiness.slug) {
        queryClient.setQueryData(["business", updatedBusiness.slug], updatedBusiness);
      }
      toast.success("Configuración guardada correctamente");
    },

    onError: (error: Error) => {
      console.error(error);
      toast.error(
        getApiErrorMessage(error, "Error guardando configuración"),
      );
    },
  });
};
