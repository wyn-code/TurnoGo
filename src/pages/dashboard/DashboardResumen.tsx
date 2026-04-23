import { CalendarDays, Users, Briefcase, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Turnos hoy", value: 0, icon: CalendarDays, color: "text-primary" },
  { label: "Próximos turnos", value: 0, icon: Clock, color: "text-primary" },
  { label: "Clientes totales", value: 0, icon: Users, color: "text-primary" },
  { label: "Servicios activos", value: 0, icon: Briefcase, color: "text-primary" },
];

const DashboardResumen = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 text-center">
          <p className="text-muted-foreground">Las estadísticas estarán disponibles próximamente.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardResumen;
