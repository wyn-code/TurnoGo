import { Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EmployeeStatItem } from "@/types/statistics";
import { formatCurrency } from "@/utils/format";

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

interface StatsEmployeeCardProps {
  employee: EmployeeStatItem;
  index: number;
}

export function StatsEmployeeCard({ employee, index }: StatsEmployeeCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {index < 3 ? (
            <span className="text-lg" role="img" aria-label={`Puesto ${index + 1}`}>
              {RANK_EMOJI[index]}
            </span>
          ) : (
            <Medal size={16} className="text-muted-foreground" />
          )}
          <span className="truncate">{employee.nombre}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Turnos</span>
          <span className="font-semibold text-foreground">{employee.turnos}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Facturación</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(employee.ingresos)}
          </span>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Ocupación</span>
            <span className="font-semibold text-foreground">
              {employee.ocupacion}%
            </span>
          </div>
          <Progress value={employee.ocupacion} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
