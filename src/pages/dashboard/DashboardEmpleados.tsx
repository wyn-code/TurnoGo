import { useEffect, useState } from "react";
// Importá tu servicio y el tipo
import { businessService } from "@/services/business.service"; 
import type { ApiEmployee } from "@/types/api"; 
import { toast } from "sonner";

const DashboardEmpleados = () => {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // El businessId lo podrías sacar de un context de Auth o de la URL
  const businessId = "1"; 

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        // Usamos el método que ya tenés en tu api.ts / service
        const data = await businessService.getBusinessProfessionals(businessId);
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

  if (isLoading) return <p>Cargando profesionales...</p>;

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