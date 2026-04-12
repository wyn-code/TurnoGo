import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessEmployeesStep({ form }: Props) {
  const { control, register } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="border p-3 rounded space-y-3">
          <Input
            {...register(`employees.${i}.name`)}
            placeholder="Nombre completo"
          />

          <Input
            {...register(`employees.${i}.specialty`)}
            placeholder="Especialidad"
          />

          <Button type="button" onClick={() => remove(i)}>
            Eliminar
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            name: "",
            specialty: "",
          })
        }
      >
        Agregar empleado
      </Button>
    </div>
  );
}
