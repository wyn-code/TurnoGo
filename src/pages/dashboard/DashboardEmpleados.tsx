import { Loader2 } from "lucide-react";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { useEmployees } from "@/hooks/queries/useEmployeesQuery";

const DashboardEmpleados = () => {
  const { business, isLoadingBusiness } = useDashboardBusiness();
  const businessId = business?.id_negocio ? String(business.id_negocio) : null;

  // ✅ React Query - Datos con caché automático
  const { data: employees = [], isLoading, error } = useEmployees(businessId);

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ✅ Error handling
  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-8 text-center">
        <p className="text-destructive">
          Error cargando empleados: {error.message}
        </p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {employees.map((emp) => (
        <div key={emp.id_empleado} className="p-4 border rounded">
          <p className="font-bold">
            {emp.nombre} {emp.apellido}
          </p>
          <p className="text-sm text-muted-foreground">{emp.telefono}</p>
          <span
            className={
              emp.activo
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {emp.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      ))}

      {employees.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No hay profesionales registrados en este negocio.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardEmpleados;