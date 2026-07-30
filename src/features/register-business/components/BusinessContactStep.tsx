import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessContactStep({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wsp">WhatsApp</Label>
        <Input
          {...register("wsp")}
          id="wsp"
          placeholder="ej: 3411234567"
        />
        {errors.wsp && <p className="text-xs text-destructive">{errors.wsp.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input
          {...register("telefono")}
          id="telefono"
          placeholder="ej: 3411234567"
        />
        {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ig_url">Instagram (opcional)</Label>
        <Input
          {...register("ig_url")}
          id="ig_url"
          placeholder="https://instagram.com/tu-cuenta"
        />
        {errors.ig_url && <p className="text-xs text-destructive">{errors.ig_url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url_fb">Facebook (opcional)</Label>
        <Input
          {...register("url_fb")}
          id="url_fb"
          placeholder="https://facebook.com/tu-cuenta"
        />
        {errors.url_fb && <p className="text-xs text-destructive">{errors.url_fb.message}</p>}
      </div>
    </div>
  );
}
