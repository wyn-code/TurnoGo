import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Power, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { businessService } from "@/services/business.service";
import type { ApiService } from "@/types/api";

const DashboardServicios = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // El id del negocio (luego vendrá de un contexto de usuario)
  const businessId = "1";

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const data = await businessService.getBusinessServices(businessId);
        setServices(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los servicios");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Servicios</h2>
        <Button size="sm" onClick={() => toast.info("Crear servicio (próximamente)")}>
          <Plus size={14} className="mr-1" /> Nuevo servicio
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <Card key={s.id_servicio}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                {/* Cambiamos s.name por s.nombre y s.price por s.precio */}
                <p className="font-medium text-foreground">{s.nombre_servicio}</p>
                <p className="text-sm text-muted-foreground">
                  {s.duracion_min} min · ${s.precio.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Badge 
                  variant={s.activo ? "secondary" : "outline"} 
                  className={s.activo ? "bg-primary/10 text-primary" : "text-muted-foreground"}
                >
                  {s.activo ? "Activo" : "Inactivo"}
                </Badge>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toast.info(`Editando ${s.nombre_servicio}`)}
                >
                  <Edit size={14} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toast.info("Cambiar estado (próximamente)")}
                >
                  <Power size={14} className={s.activo ? "text-foreground" : "text-destructive"} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay servicios registrados.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardServicios;