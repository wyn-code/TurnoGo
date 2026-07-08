import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import type { ApiServicio } from "@/types/api";

const serviceSchema = z
  .object({
    nombre_servicio: z.string().min(3, "Mínimo 3 caracteres"),
    precio: z.number().min(1, "El precio debe ser mayor a 0"),
    duracion_min: z.number().min(1, "La duración mínima debe ser mayor a 0"),
    duracion_max: z.number().min(1, "La duración máxima debe ser mayor a 0"),
    requiere_aprobacion: z.boolean(),
    activo: z.boolean(),
  })
  .refine((data) => data.duracion_max >= data.duracion_min, {
    message: "La duración máxima debe ser mayor o igual a la mínima",
    path: ["duracion_max"],
  });

export type ServiceFormValues = z.infer<typeof serviceSchema>;

const defaultValues: ServiceFormValues = {
  nombre_servicio: "",
  precio: 1000,
  duracion_min: 30,
  duracion_max: 60,
  requiere_aprobacion: false,
  activo: true,
};

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  service?: ApiServicio | null;
  isLoading?: boolean;
}

export function ServiceForm({
  open,
  onOpenChange,
  onSubmit,
  service,
  isLoading,
}: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (service) {
      form.reset({
        nombre_servicio: service.nombre_servicio,
        precio: service.precio,
        duracion_min: service.duracion_min,
        duracion_max: service.duracion_max,
        requiere_aprobacion: service.requiere_aprobacion,
        activo: service.activo,
      });
      return;
    }

    form.reset(defaultValues);
  }, [service, open, form]);

  const handleInvalid = () => {
    const firstError = Object.values(form.formState.errors)[0];
    toast.error(
      firstError?.message?.toString() ??
        "Revisá los campos del formulario",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar servicio" : "Nuevo servicio"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre_servicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Corte clásico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? 0
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duracion_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración mínima (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duracion_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración máxima (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiere_aprobacion"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Requiere aprobación</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Servicio activo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : service
                  ? "Guardar cambios"
                  : "Crear servicio"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
