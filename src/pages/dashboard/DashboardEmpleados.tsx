import { useEffect, useState } from "react";
// Importá tu servicio y el tipo
import { businessService } from "@/services/business.service"; 
import type { ApiEmpleado } from "@/types/api"; 
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";

const DashboardEmpleados = () => {
  const [employees, setEmployees] = useState<ApiEmpleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio;

  useEffect(() => {
    const loadEmployees = async () => {
      if (!businessId) {
        setEmployees([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await businessService.getBusinessProfessionals(String(businessId));
        setEmployees(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los empleados");
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [businessId]);

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!businessId) {
    return <p>No encontramos un negocio vinculado a tu usuario.</p>;
  }

  return (
    <div className="grid gap-4">
      {employees.map((emp) => (
        <div key={emp.id_empleado} className="p-4 border rounded">
          <p className="font-bold">{emp.nombre} {emp.apellido}</p>
          <p className="text-sm text-muted-foreground">{emp.telefono}</p>
          <span className={emp.activo ? "text-green-500" : "text-red-500"}>
            {emp.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      ))}
      
      {employees.length === 0 && (
        <p>No hay profesionales registrados en este negocio.</p>
      )}
    </div>
  );
};

export default DashboardEmpleados;