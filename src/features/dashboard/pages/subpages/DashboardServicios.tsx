import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Power, PowerOff, Loader2, PackageX } from "lucide-react";
import { toast } from "sonner";
import type { ApiServicio } from "@/types/api";
import { ServiceForm, type ServiceFormValues } from "./services/ServiceForm";
import { DeactivateServiceDialog } from "./services/DeactivateServiceDialog";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { useCreateService } from "@/hooks/mutations/useCreateService";
import { useUpdateService } from "@/hooks/mutations/useUpdateService";
import { useToggleService } from "@/hooks/mutations/useToggleService";

const DashboardServicios = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ? String(business.id_negocio) : null;
  const [showInactive, setShowInactive] = useState(false);

  const {
    data: services = [],
    isLoading,
    error,
  } = useServices(businessId, { includeInactive: showInactive });

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const toggleMutation = useToggleService();

  const [selectedService, setSelectedService] = useState<ApiServicio | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceToDeactivate, setServiceToDeactivate] =
    useState<ApiServicio | null>(null);

  const handleSubmit = async (values: ServiceFormValues) => {
    if (!businessId) return;

    try {
      if (selectedService) {
        await updateMutation.mutateAsync({
          id: selectedService.id_servicio,
          data: {
            nombre_servicio: values.nombre_servicio,
            precio: values.precio,
            duracion_min: values.duracion_min,
            duracion_max: values.duracion_max,
            requiere_aprobacion: values.requiere_aprobacion,
            activo: values.activo,
          },
        });
        toast.success("Servicio actualizado");
      } else {
        await createMutation.mutateAsync({
          id_negocio: Number(businessId),
          nombre_servicio: values.nombre_servicio,
          precio: values.precio,
          duracion_min: values.duracion_min,
          duracion_max: values.duracion_max,
          requiere_aprobacion: values.requiere_aprobacion,
          activo: values.activo,
        });
        toast.success("Servicio creado");
      }

      setIsFormOpen(false);
      setSelectedService(null);
    } catch {
      // Los hooks ya muestran el toast de error
    }
  };

  const runToggle = async (service: ApiServicio) => {
    const updated = await toggleMutation.mutateAsync(service.id_servicio);
    toast.success(
      updated.activo ? "Servicio reactivado" : "Servicio desactivado",
    );
  };

  const handleStatusClick = async (service: ApiServicio) => {
    if (service.activo) {
      setServiceToDeactivate(service);
    } else {
      try {
        await runToggle(service);
      } catch {
        toast.error("Error al reactivar");
      }
    }
  };

  const confirmDeactivate = async () => {
    if (!serviceToDeactivate) return;

    try {
      await runToggle(serviceToDeactivate);
      setServiceToDeactivate(null);
    } catch {
      // El hook ya muestra el toast de error
    }
  };

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PackageX className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-medium text-destructive">Error al cargar servicios</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <PackageX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Sin negocio vinculado</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Servicios</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="show-inactive-services"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label
                htmlFor="show-inactive-services"
                className="cursor-pointer text-sm text-muted-foreground"
              >
                Ver inactivos
              </Label>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setSelectedService(null);
                setIsFormOpen(true);
              }}
              disabled={createMutation.isPending}
            >
              <Plus size={14} className="mr-1" />
              Nuevo servicio
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <Card
              key={s.id_servicio}
              className={`transition-shadow hover:shadow-md ${!s.activo ? "border-dashed opacity-90" : ""}`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">
                    {s.nombre_servicio}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {s.duracion_min}-{s.duracion_max} min · $
                    {s.precio.toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Badge
                    variant={s.activo ? "secondary" : "outline"}
                    className={
                      s.activo
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {s.activo ? "Activo" : "Inactivo"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedService(s);
                      setIsFormOpen(true);
                    }}
                    disabled={updateMutation.isPending}
                    title="Editar"
                  >
                    <Edit size={14} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStatusClick(s)}
                    disabled={toggleMutation.isPending}
                    title={s.activo ? "Desactivar" : "Reactivar"}
                    className={
                      s.activo
                        ? "text-muted-foreground hover:text-destructive"
                        : "text-primary hover:text-primary"
                    }
                  >
                    {s.activo ? (
                      <PowerOff size={14} />
                    ) : (
                      <Power size={14} />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <PackageX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {showInactive ? "Sin servicios inactivos" : "Sin servicios activos"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {showInactive
                ? "No hay servicios inactivos."
                : "No hay servicios activos. Activá «Ver inactivos» para reactivar uno."}
            </p>
          </div>
        )}
      </div>

      <ServiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        service={selectedService}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeactivateServiceDialog
        service={serviceToDeactivate}
        open={serviceToDeactivate != null}
        onOpenChange={(open) => {
          if (!open) setServiceToDeactivate(null);
        }}
        onConfirm={confirmDeactivate}
        isLoading={toggleMutation.isPending}
      />
    </>
  );
};

export default DashboardServicios;
