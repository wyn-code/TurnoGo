import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import CLOUDINARY_CONFIG from "@/lib/cloudinary";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessImageStep({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const logoValue = watch("logo");

  return (
    <div className="space-y-4">
      <Label htmlFor="logo">Logo o imagen del negocio</Label>
      <ImageUpload
        value={logoValue}
        onChange={(url) => {
          setValue("logo", url, { shouldValidate: true });
        }}
        cloudName={CLOUDINARY_CONFIG.cloudName}
        uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
      />
      <input {...register("logo")} type="hidden" />
      {errors.logo && <p className="text-xs text-red-500">{errors.logo.message}</p>}
    </div>
  );
}