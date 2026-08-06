import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { useUpdateBusiness } from "@/hooks/mutations/useBusinessService";
import { useProvincias, useLocalidades } from "@/hooks/queries/useGeorefQuery";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const configSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  telefono: z.string().regex(/^\+?[0-9\s\-()]*$/, "Teléfono inválido").nullable().optional(),
  wsp: z.string().regex(/^\+?[0-9\s\-()]*$/, "WhatsApp inválido"),
  ig_url: z.union([z.string().url("URL inválida"),z.literal(""),z.null(),]).optional(),
  direccion: z.string().min(5, "Dirección requerida"),
  id_provincia: z.string().min(1, "Seleccioná una provincia"),
  id_localidad: z.string().min(1, "Seleccioná una ciudad"),
});

type ConfigFormData = z.infer<typeof configSchema>;

const DashboardConfiguracion = () => {
  const { business, isLoadingBusiness, refreshBusiness } = useDashboardBusiness();
  const { mutateAsync: updateBusiness, isPending } = useUpdateBusiness();

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    values: {
      nombre: business?.nombre ?? "",
      telefono: business?.telefono ?? "",
      wsp: business?.wsp ?? "",
      ig_url: business?.ig_url ?? "",
      direccion: business?.direccion ?? "",
      id_provincia: business?.id_provincia != null ? String(business.id_provincia) : "",
      id_localidad: business?.id_localidad != null ? String(business.id_localidad) : "",
    },
  });

  const selectedProvinciaId = form.watch("id_provincia");
  const selectedLocalidadId = form.watch("id_localidad");

  const { data: provincias, isLoading: loadingProvincias } = useProvincias();
  const { data: localidades, isLoading: loadingLocalidades } = useLocalidades(
    selectedProvinciaId ? Number(selectedProvinciaId) : null,
  );

  useEffect(() => {
    if (
      selectedLocalidadId &&
      localidades &&
      localidades.length > 0 &&
      !localidades.some((l) => String(l.id_localidad) === selectedLocalidadId)
    ) {
      form.setValue("id_localidad", "", { shouldValidate: true });
    }
  }, [localidades, selectedLocalidadId, form]);

  const provinciaOptions = (provincias ?? []).map((p) => ({
    value: String(p.id_provincia),
    label: p.nombre,
  }));

  const localidadOptions = (localidades ?? []).map((l) => ({
    value: String(l.id_localidad),
    label: l.nombre,
  }));

  const handleProvinciaChange = (value: string) => {
    form.setValue("id_provincia", value, { shouldValidate: true });
    form.setValue("id_localidad", "", { shouldValidate: true });
  };

  const onSubmit = async (data: ConfigFormData) => {
    if (!business) {
      return toast.error("No hay negocio seleccionado");
    }

    try {
      await updateBusiness({
        business,
        changes: {
          nombre: data.nombre.trim(),
          telefono: data.telefono?.trim() || null,
          wsp: data.wsp.trim(),
          ig_url: data.ig_url?.trim() || null,
          direccion: data.direccion.trim(),
          id_provincia: Number(data.id_provincia),
          id_localidad: Number(data.id_localidad),
        },
      });
      await refreshBusiness();
    } catch {
      // El hook ya muestra el error
    }
  };

  if (isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando..." />
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
        <Button size="sm" type="submit" form="config-form" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <Form {...form}>
            <form id="config-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del negocio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Barbería Don Carlos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 11 4567-8901" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wsp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp *</FormLabel>
                      <FormControl>
                        <Input placeholder="+5491145678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ig_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                      <FormControl>
                      <Input placeholder="https://instagram.com/tunegocio" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección *</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Principal 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={provinciaOptions}
                          value={field.value}
                          onValueChange={handleProvinciaChange}
                          placeholder="Seleccioná una provincia"
                          emptyText="No se encontraron provincias"
                          searchPlaceholder="Buscar provincia..."
                          disabled={loadingProvincias}
                          loading={loadingProvincias}
                          selectedLabel={business.provincia_nombre}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="id_localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad / Localidad *</FormLabel>
                    <FormControl>
                      <Combobox
                        options={localidadOptions}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        placeholder="Seleccioná una ciudad"
                        emptyText="No se encontraron ciudades"
                        searchPlaceholder="Buscar ciudad..."
                        disabled={!selectedProvinciaId}
                        loading={!!selectedProvinciaId && loadingLocalidades}
                        selectedLabel={business.localidad_nombre}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracion;
