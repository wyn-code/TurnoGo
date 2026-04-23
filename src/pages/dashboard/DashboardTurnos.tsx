import { Card, CardContent } from "@/components/ui/card";

const DashboardTurnos = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Gestión de turnos</h2>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">La gestión de turnos estará disponible próximamente.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTurnos;
