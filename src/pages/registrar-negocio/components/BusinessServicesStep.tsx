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
    name: "services",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="border p-3 rounded space-y-3">
          <Input
            {...register(`services.${i}.name`)}
            placeholder="Nombre"
          />

          <Input
            type="number"
            {...register(`services.${i}.duration`, { valueAsNumber: true })}
            placeholder="Duración"
          />

          <Input
            type="number"
            {...register(`services.${i}.price`, { valueAsNumber: true })}
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
          append({ name: "", duration: 30, price: 0, description: "" })
        }
      >
        Agregar servicio
      </Button>
    </div>
  );
}