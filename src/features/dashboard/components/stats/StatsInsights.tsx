import { useMemo } from "react";
import {
  DollarSign,
  Clock,
  Award,
  Activity,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStatistics } from "@/types/statistics";

interface StatsInsightsProps {
  statistics: DashboardStatistics;
}

interface Insight {
  icon: typeof DollarSign;
  text: string;
}

export function StatsInsights({ statistics }: StatsInsightsProps) {
  const visible = useMemo(() => {
    const insights: Insight[] = [];

    if (statistics.kpis.ingresoTotal.delta && statistics.kpis.ingresoTotal.trend) {
      const sign = statistics.kpis.ingresoTotal.trend === "up" ? "aumentaron" : "disminuyeron";
      insights.push({
        icon: DollarSign,
        text: `Los ingresos ${sign} un ${statistics.kpis.ingresoTotal.delta}.`,
      });
    }

    if (statistics.agenda.horarioPico !== "—") {
      insights.push({
        icon: Clock,
        text: `El horario de mayor demanda es ${statistics.agenda.horarioPico}.`,
      });
    }

    if (statistics.kpis.servicioMasVendido !== "—") {
      insights.push({
        icon: Award,
        text: `El servicio más solicitado fue ${statistics.kpis.servicioMasVendido}.`,
      });
    }

    if (statistics.agenda.ocupacionPorcentaje > 0) {
      insights.push({
        icon: Activity,
        text: `La agenda tiene una ocupación del ${statistics.agenda.ocupacionPorcentaje}%.`,
      });
    }

    if (statistics.asistencia.tasaAsistencia > 0) {
      insights.push({
        icon: CalendarCheck,
        text: `La asistencia alcanzó el ${statistics.asistencia.tasaAsistencia}%.`,
      });
    }

    if (statistics.kpis.diaMasFacturado !== "—") {
      insights.push({
        icon: Sparkles,
        text: `${statistics.kpis.diaMasFacturado} fue el día con mayor facturación.`,
      });
    }

    return insights.slice(0, 6);
  }, [statistics]);

  if (visible.length === 0) return null;

  return (
    <Card className="border-primary/10 bg-primary/[0.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles size={18} className="text-primary" />
          Insights del período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background/50 p-3"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon size={13} className="text-primary" />
                </div>
                <p className="text-sm text-foreground leading-snug">
                  {insight.text}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
