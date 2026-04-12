import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessInfoStep({ form }: Props) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <Input {...register("name")} placeholder="Nombre del negocio" />
      <Input {...register("category")} placeholder="Rubro" />
      <Input {...register("description")} placeholder="Descripción" />
    </div>
  );
}