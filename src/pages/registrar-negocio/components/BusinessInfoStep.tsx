import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "../schema";
import type { ApiCategory } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import businessService from "@/services/business.service";

type Props = {
  form: UseFormReturn<FormData>;
};

export default function BusinessInfoStep({ form }: Props) {
  const { register, formState: { errors } } = form;
  
  // 1. Estado para almacenar las categorías de la DB
  const [categorias, setCategorias] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        // Llamamos a tu método del service (GET /api/categorias)
        const data = await businessService.getCategories();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Nombre del Negocio */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del negocio</Label>
        <Input 
          {...register("name")} 
          id="name"
          placeholder="Ej: Barbería Rocco" 
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Categoría (Select Dinámico) */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoría / Rubro</Label>
        <select
          {...register("category")}
          id="category"
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          {...register("description")}
          id="description"
          placeholder="Contanos brevemente qué hacés..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
    </div>
  );
}