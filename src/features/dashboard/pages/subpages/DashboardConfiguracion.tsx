import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardBusiness } from "@/features/dashboard/contexts/DashboardBusinessContext";
import { useUpdateBusiness } from "@/hooks/mutations/useBusinessService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const configSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  telefono: z.string().regex(/^\+?[0-9\s\-()]*$/, "Teléfono inválido").nullable().optional(),
  wsp: z.string().regex(/^\+?[0-9\s\-()]*$/, "WhatsApp inválido"),
  ig_url: z.union([z.string().url("URL inválida"),z.literal(""),z.null(),]).optional(),
  direccion: z.string().min(5, "Dirección requerida"),
  ciudad: z.string().min(3, "Ciudad requerida"),
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
      ciudad: business?.ciudad ?? "",
    },
  });

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
          ciudad: data.ciudad.trim(),
        },
      });
      await refreshBusiness();
      toast.success("Configuración guardada");
    } catch {
      // El hook ya muestra el error
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
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Buenos Aires" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConfiguracion;