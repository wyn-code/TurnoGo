import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessEmployeesStep({ form }: Props) {
  const { control, register, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "empleados",
  });

  return (
    <div className="space-y-4">
      {errors.empleados && !Array.isArray(errors.empleados) && (
        <p className="text-xs text-destructive">{errors.empleados.message}</p>
      )}

      {fields.map((field, i) => (
        <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`empleados.${i}.nombre`}>Nombre</Label>
              <Input
                {...register(`empleados.${i}.nombre`)}
                id={`empleados.${i}.nombre`}
                placeholder="Ej: Juan"
              />
              {errors.empleados?.[i]?.nombre && (
                <p className="text-xs text-destructive">{errors.empleados[i]?.nombre?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`empleados.${i}.apellido`}>Apellido</Label>
              <Input
                {...register(`empleados.${i}.apellido`)}
                id={`empleados.${i}.apellido`}
                placeholder="Ej: Pérez"
              />
              {errors.empleados?.[i]?.apellido && (
                <p className="text-xs text-destructive">{errors.empleados[i]?.apellido?.message}</p>
              )}
            </div>
          </div>

          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Eliminar empleado
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            nombre: "",
            apellido: "",
          })
        }
      >
        Agregar empleado
      </Button>
    </div>
  );
}
