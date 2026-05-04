import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Props = {
  form: UseFormReturn<FormData>;
};

const PROVINCES = [
  { id: 1, name: "Buenos Aires" },
  { id: 2, name: "Catamarca" },
  { id: 3, name: "Chaco" },
  { id: 4, name: "Chubut" },
  { id: 5, name: "Córdoba" },
  { id: 6, name: "Corrientes" },
  { id: 7, name: "Entre Ríos" },
  { id: 8, name: "Formosa" },
  { id: 9, name: "Jujuy" },
  { id: 10, name: "La Pampa" },
  { id: 11, name: "La Rioja" },
  { id: 12, name: "Mendoza" },
  { id: 13, name: "Misiones" },
  { id: 14, name: "Neuquén" },
  { id: 15, name: "Río Negro" },
  { id: 16, name: "Salta" },
  { id: 17, name: "San Juan" },
  { id: 18, name: "San Luis" },
  { id: 19, name: "Santa Cruz" },
  { id: 20, name: "Santa Fe" },
  { id: 21, name: "Santiago del Estero" },
  { id: 22, name: "Tierra del Fuego" },
  { id: 23, name: "Tucumán" },
  { id: 24, name: "Ciudad Autónoma de Buenos Aires" },
];

export default function BusinessLocationStep({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input {...register("direccion")} id="direccion" placeholder="Dirección" />
        {errors.direccion && (
          <p className="text-xs text-red-500">{errors.direccion.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciudad">Ciudad</Label>
        <Input {...register("ciudad")} id="ciudad" placeholder="Ciudad" />
        {errors.ciudad && (
          <p className="text-xs text-red-500">{errors.ciudad.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="id_provincia">Provincia</Label>
        <select
          {...register("id_provincia")}
          id="id_provincia"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue=""
        >
          <option value="">Seleccioná una provincia</option>
          {PROVINCES.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
        {errors.id_provincia && (
          <p className="text-xs text-red-500">{errors.id_provincia.message}</p>
        )}
      </div>
    </div>
  );
}