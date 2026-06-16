import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";

import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const imagenes = watch("imagenes") || [];

  const addImage = (url: string) => {
    setValue("imagenes", [...imagenes, url], { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    setValue(
      "imagenes",
      imagenes.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-8">
      {/* LOGO */}
      <div className="space-y-3">
        <Label htmlFor="logo">Logo del negocio</Label>

        <ImageUpload
          value={logoValue}
          onChange={(url) =>
            setValue("logo", url, {
              shouldValidate: true,
            })
          }
          cloudName={CLOUDINARY_CONFIG.cloudName}
          uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
        />

        <input {...register("logo")} type="hidden" />

        {errors.logo && (
          <p className="text-xs text-red-500">{errors.logo.message}</p>
        )}
      </div>

      {/* GALERÍA */}
      <div className="space-y-3">
        <Label>Fotos del negocio</Label>

        <ImageUpload
          value=""
          onChange={addImage}
          cloudName={CLOUDINARY_CONFIG.cloudName}
          uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
        />

        <input {...register("imagenes")} type="hidden" />

        {imagenes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {imagenes.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover border"
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
