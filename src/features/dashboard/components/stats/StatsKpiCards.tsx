import { useMemo } from "react";
import { TrendingUp, TrendingDown, Users, BarChart3, DollarSign, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MetricWithDelta, DashboardStatistics, TabValue } from "@/types/statistics";
import { formatCurrency } from "@/utils/format";

const formatMetricValue = (value: number, asCurrency = false) =>
  asCurrency ? formatCurrency(value) : value.toLocaleString("es-AR");

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  onClick?: () => void;
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  trend,
  onClick,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "group transition-all duration-200",
        onClick &&
          "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-primary/20"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {delta && trend && (
              <div className="flex items-center gap-1 pt-0.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    trend === "up"
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                  )}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {delta}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  vs período anterior
                </span>
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/15">
            <Icon size={22} className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  metric: MetricWithDelta;
  asCurrency?: boolean;
  onClick?: () => void;
}

export function MetricCard({
  icon,
  label,
  metric,
  asCurrency = false,
  onClick,
}: MetricCardProps) {
  return (
    <KpiCard
      icon={icon}
      label={label}
      value={formatMetricValue(metric.value, asCurrency)}
      delta={metric.delta}
      trend={metric.trend}
      onClick={onClick}
    />
  );
}

interface StatsKpiCardsProps {
  statistics: DashboardStatistics;
  onNavigate: (tab: TabValue) => void;
}

export function StatsKpiCards({ statistics, onNavigate }: StatsKpiCardsProps) {
  const totalSolicitados = useMemo(
    () => statistics.servicios.items.reduce((sum, s) => sum + s.solicitados, 0),
    [statistics.servicios.items],
  );
  const totalIngresosServicios = useMemo(
    () => statistics.servicios.items.reduce((sum, s) => sum + s.ingresos, 0),
    [statistics.servicios.items],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={Users}
        label="Clientes nuevos"
        metric={statistics.clientes.nuevos}
        onClick={() => onNavigate("clientes")}
      />
      <MetricCard
        icon={BarChart3}
        label="Servicios solicitados"
        metric={{ value: totalSolicitados }}
        onClick={() => onNavigate("servicios")}
      />
      <MetricCard
        icon={DollarSign}
        label="Ingresos totales"
        metric={{ value: totalIngresosServicios }}
        asCurrency
        onClick={() => onNavigate("ingresos")}
      />
      <MetricCard
        icon={UserCheck}
        label="Tasa de asistencia"
        metric={{ value: statistics.asistencia.tasaAsistencia }}
        onClick={() => onNavigate("asistencia")}
      />
    </div>
  );
}
