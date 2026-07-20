import { Check, Crown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StatisticsRange, StatisticsCompare } from "@/types/statistics";

const RANGE_LABELS: Record<StatisticsRange, string> = {
  hoy: "Hoy",
  semana: "Esta semana",
  mes: "Este mes",
  anio: "Este año",
};

const COMPARE_LABELS: Record<StatisticsCompare, string> = {
  anterior: "Período anterior",
  anio: "Año anterior",
};

interface StatsHeaderProps {
  businessName: string;
  rango: StatisticsRange;
  comparar: StatisticsCompare;
  isFetching: boolean;
}

export function StatsHeader({
  businessName,
  rango,
  comparar,
  isFetching,
}: StatsHeaderProps) {
  return (
    <div>
  <div className="flex items-center gap-2">
    <h2 className="text-2xl font-bold tracking-tight text-foreground">
      Estadísticas
    </h2>

    <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <Crown size={12} className="mr-1" /> Premium
    </Badge>

    {isFetching ? (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        <span>Actualizando…</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-green-600" />
        <span>Actualizado</span>
      </div>
    )}
  </div>

  <p className="mt-0.5 text-sm text-muted-foreground">
    Rendimiento de {businessName} · Período: {RANGE_LABELS[rango]} ·
    Comparando con: {COMPARE_LABELS[comparar]}
  </p>
</div>
  );
}
