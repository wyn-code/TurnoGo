import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessLocationStep({ form }: Props) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <Input {...register("address")} placeholder="Dirección" />
      <Input {...register("city")} placeholder="Ciudad" />
      <Input {...register("locality")} placeholder="Localidad" />
      <Input {...register("province")} placeholder="Provincia" />
    </div>
  );
}