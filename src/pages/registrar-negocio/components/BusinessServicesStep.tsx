import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessServicesStep({ form }: Props) {
  const { control, register } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "servicios",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="border p-3 rounded space-y-3">
          <Input
            {...register(`servicios.${i}.nombre_servicio`)}
            placeholder="Nombre del servicio"
          />

          <Input
            type="number"
            {...register(`servicios.${i}.duracion_min`, { valueAsNumber: true })}
            placeholder="Duración (minutos)"
          />

          <Input
            type="number"
            {...register(`servicios.${i}.precio`, { valueAsNumber: true })}
            placeholder="Precio"
          />

          <Button type="button" onClick={() => remove(i)}>
            Eliminar
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({ nombre_servicio: "", activo: true })
        }
      >
        Agregar servicio
      </Button>
    </div>
  );
}