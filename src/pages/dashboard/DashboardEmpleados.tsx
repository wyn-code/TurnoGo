import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProfessionalCard from "@/components/business/ProfessionalCard";
import { professionals } from "@/data/mockData";
import type { ApiEmployee } from "@/types/api";
import { toast } from "sonner";

const DashboardEmpleados = () => {
  const bizProfessionals: ApiEmployee[] = professionals
    .filter((p) => p.businessId === "1")
    .map((p) => {
      const [firstName, ...rest] = p.name.split(" ");

      return {
        id_empleado: Number(p.id),
        id_negocio: Number(p.businessId),
        nombre: firstName,
        apellido: rest.join(" "),
        telefono: p.phone ?? "",
        activo: p.active ?? true,
      };
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Empleados</h2>
        <Button size="sm" onClick={() => toast.info("Agregar empleado (próximamente)")}>
          <Plus size={14} className="mr-1" /> Nuevo empleado
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bizProfessionals.map((p) => (
          <ProfessionalCard key={p.id_empleado} professional={p} />
        ))}
      </div>
    </div>
  );
};

export default DashboardEmpleados;
