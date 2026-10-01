import { Medal, Power } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { CanchaStatItem } from "@/types/statistics";
import { formatCurrency } from "@/utils/format";

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

interface StatsCanchaCardProps {
  cancha: CanchaStatItem;
  index: number;
}

export function StatsCanchaCard({ cancha, index }: StatsCanchaCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {cancha.inactiva ? (
            <Power size={16} className="text-muted-foreground" />
          ) : index < 3 ? (
            <span className="text-lg" role="img" aria-label={`Puesto ${index + 1}`}>
              {RANK_EMOJI[index]}
            </span>
          ) : (
            <Medal size={16} className="text-muted-foreground" />
          )}
          <span className="truncate">{cancha.nombre}</span>
          {cancha.inactiva && (
            <Badge variant="secondary" className="ml-auto shrink-0">
              Inactiva
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Turnos</span>
          <span className="font-semibold text-foreground">{cancha.turnos}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Facturación</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(cancha.ingresos)}
          </span>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Ocupación</span>
            <span className="font-semibold text-foreground">
              {cancha.ocupacion}%
            </span>
          </div>
          <Progress value={cancha.ocupacion} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
