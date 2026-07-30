import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessServicesStep({ form }: Props) {
  const { control, register, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "servicios",
  });

  return (
    <div className="space-y-4">
      {errors.servicios && !Array.isArray(errors.servicios) && (
        <p className="text-xs text-destructive">{errors.servicios.message}</p>
      )}

      {fields.map((field, i) => (
        <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`servicios.${i}.nombre_servicio`}>Nombre del servicio</Label>
            <Input
              {...register(`servicios.${i}.nombre_servicio`)}
              id={`servicios.${i}.nombre_servicio`}
              placeholder="Ej: Corte de pelo"
            />
            {errors.servicios?.[i]?.nombre_servicio && (
              <p className="text-xs text-destructive">{errors.servicios[i]?.nombre_servicio?.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`servicios.${i}.duracion_min`}>Duración (min)</Label>
              <Input
                type="number"
                {...register(`servicios.${i}.duracion_min`, { valueAsNumber: true })}
                id={`servicios.${i}.duracion_min`}
                placeholder="30"
              />
              {errors.servicios?.[i]?.duracion_min && (
                <p className="text-xs text-destructive">{errors.servicios[i]?.duracion_min?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`servicios.${i}.precio`}>Precio ($)</Label>
              <Input
                type="number"
                {...register(`servicios.${i}.precio`, { valueAsNumber: true })}
                id={`servicios.${i}.precio`}
                placeholder="1500"
              />
              {errors.servicios?.[i]?.precio && (
                <p className="text-xs text-destructive">{errors.servicios[i]?.precio?.message}</p>
              )}
            </div>
          </div>

          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Eliminar servicio
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ nombre_servicio: "", activo: true })
        }
      >
        Agregar servicio
      </Button>
    </div>
  );
}
