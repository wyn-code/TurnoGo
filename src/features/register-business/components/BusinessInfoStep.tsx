import { useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useApi";
import { isDeportesCategoria } from "@/lib/business-category";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessInfoStep({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const categoriesQuery = useCategories();
  const categorias = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const isLoading = categoriesQuery.isLoading;

  const idCategoriaSeleccionada = watch("id_categoria");

  // "Deportes" reserva espacios en lugar de empleados: hay que avisarle al
  // resto del formulario apenas se elige la categoría.
  useEffect(() => {
    const categoria = categorias.find(
      (cat) => String(cat.id_categoria) === String(idCategoriaSeleccionada),
    );

    setValue("es_deportes", isDeportesCategoria(categoria, categorias));
  }, [categorias, idCategoriaSeleccionada, setValue]);

  return (
    <div className="space-y-6">
      {/* Nombre del Negocio */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del negocio</Label>
        <Input 
          {...register("nombre")} 
          id="nombre"
          placeholder="Ej: Barbería Rocco" 
        />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      {/* Categoría (Select Dinámico) */}
      <div className="space-y-2">
        <Label htmlFor="id_categoria">Categoría / Rubro</Label>
        <select
          {...register("id_categoria")}
          id="id_categoria"
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
        >
          <option value="">
            {isLoading ? "Cargando rubros..." : "Seleccioná una categoría"}
          </option>
          
          {/* 3. Mapeo de las categorías reales de la base de datos */}
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={String(cat.id_categoria)}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errors.id_categoria && <p className="text-xs text-destructive">{errors.id_categoria.message}</p>}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          {...register("descripcion")}
          id="descripcion"
          placeholder="Contanos brevemente qué hacés..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
      </div>
    </div>
  );
}
