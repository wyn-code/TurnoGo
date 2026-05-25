/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { useUpdateBusiness } from "@/hooks/mutations/useBusinessService";
import type { ApiNegocio } from "@/types/api";

type ConfigFormData = {
  nombre: string;
  telefono: string;
  wsp: string;
  ig_url: string;
  direccion: string;
  ciudad: string;
};

const getFormFromBusiness = (business: ApiNegocio | null): ConfigFormData => ({
  nombre: business?.nombre ?? "",
  telefono: business?.telefono ?? "",
  wsp: business?.wsp ?? "",
  ig_url: business?.ig_url ?? "",
  direccion: business?.direccion ?? "",
  ciudad: business?.ciudad ?? "",
});

const DashboardConfiguracion = () => {
  const { business, isLoadingBusiness, refreshBusiness } =
    useDashboardBusiness();

  const { mutateAsync: updateBusiness, isPending } = useUpdateBusiness();

  const [data, setData] = useState<ConfigFormData>(getFormFromBusiness(null));

  useEffect(() => {
    if (!business) return;
    setData(getFormFromBusiness(business));
  }, [business]);

  const update = (field: keyof ConfigFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!business) {
      return toast.error("No hay negocio seleccionado");
    }

    if (!data.nombre.trim() || !data.wsp.trim()) {
      return toast.error("Nombre y WhatsApp son obligatorios");
    }

    if (!data.direccion.trim() || !data.ciudad.trim()) {
      return toast.error("Dirección y ciudad son obligatorias");
    }

    if (business.usuario_id == null) {
      return toast.error(
        "Este negocio no tiene un usuario vinculado. Contactá soporte.",
      );
    }

    try {
      await updateBusiness({
        business,
        changes: {
          nombre: data.nombre.trim(),
          telefono: data.telefono.trim() || null,
          wsp: data.wsp.trim(),
          ig_url: data.ig_url.trim() || null,
          direccion: data.direccion.trim(),
          ciudad: data.ciudad.trim(),
        },
      });
      await refreshBusiness();
    } catch {
      // El hook ya muestra el toast de error
    }
  };

  if (isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Configuración del negocio
        </h2>

        <Button size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Nombre del negocio</Label>
            <Input
              value={data.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              placeholder="Ej: Barbería Don Carlos"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={data.telefono}
                onChange={(e) => update("telefono", e.target.value)}
                placeholder="+54 11 4567-8901"
              />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp *</Label>
              <Input
                value={data.wsp}
                onChange={(e) => update("wsp", e.target.value)}
                placeholder="+5491145678901"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input
              value={data.ig_url}
              onChange={(e) => update("ig_url", e.target.value)}
              placeholder="@tunegocio"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Dirección *</Label>
              <Input
                value={data.direccion}
                onChange={(e) => update("direccion", e.target.value)}
                placeholder="Calle Principal 123"
              />
            </div>

            <div className="space-y-2">
              <Label>Ciudad *</Label>
              <Input
                value={data.ciudad}
                onChange={(e) => update("ciudad", e.target.value)}
                placeholder="Buenos Aires"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracion;
