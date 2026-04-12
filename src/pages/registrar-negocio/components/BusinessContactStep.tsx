import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessContactStep({ form }: Props) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <Input
        {...register("whatsapp")}
        placeholder="WhatsApp (ej: 3411234567)"
      />

      <Input
        {...register("phone")}
        placeholder="Teléfono (opcional)"
      />

      <Input
        {...register("instagram")}
        placeholder="Instagram (opcional)"
      />

      <Input
        {...register("website")}
        placeholder="Sitio web (opcional)"
      />
    </div>
  );
}