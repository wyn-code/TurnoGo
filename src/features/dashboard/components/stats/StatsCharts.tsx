import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatsEmptyState } from "./StatsEmptyState";
import { BarChart3 } from "lucide-react";
import type {
  DailyComparisonItem,
  ServiceStatItem,
  HourlyDemandItem,
  AttendanceSlice,
  MonthlyIncomeItem,
} from "@/types/statistics";
import { formatCurrency } from "@/utils/format";

// Recharts content components accept complex internal props — use `any` at boundary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeTooltip = (props: any) => <ChartTooltipContent {...props} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeLegend = (props: any) => <ChartLegendContent {...props} />;

const CurrencyFormatter = (value: unknown) =>
  typeof value === "number" ? formatCurrency(value) : String(value);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CurrencyTooltip = (props: any) => (
  <ChartTooltipContent formatter={CurrencyFormatter} {...props} />
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StringTooltip = (props: any) => (
  <ChartTooltipContent formatter={(v) => String(v)} {...props} />
);

const CHART_COLORS = [
  "hsl(var(--primary))",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
];

// ── Resumen: Turnos por día ──

const resumenConfig = {
  actual: { label: "Período actual", color: "hsl(var(--primary))" },
  anterior: { label: "Período anterior", color: "#cbd5e1" },
} satisfies ChartConfig;

interface ResumenChartProps {
  data: DailyComparisonItem[];
}

export const ResumenChart = memo(function ResumenChart({ data }: ResumenChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Comparación con período anterior
        </CardTitle>
        <CardDescription>Turnos diarios actuales vs período previo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={resumenConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={SafeTooltip} />
            <ChartLegend content={SafeLegend} />
            <Bar
              dataKey="actual"
              fill="var(--color-actual)"
              name="Período actual"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={800}
            />
            <Bar
              dataKey="anterior"
              fill="var(--color-anterior)"
              name="Período anterior"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={800}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

// ── Servicios: más solicitados ──

const serviciosBarConfig = {
  solicitados: { label: "Solicitudes", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface ServiciosBarChartProps {
  data: ServiceStatItem[];
}

export const ServiciosBarChart = memo(function ServiciosBarChart({ data }: ServiciosBarChartProps) {
  if (data.length === 0) {
    return (
      <StatsEmptyState
        icon={BarChart3}
        title="Sin datos de servicios"
        description="Los servicios aparecerán cuando haya turnos registrados en el período."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Servicios más solicitados</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={serviciosBarConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              dataKey="nombre"
              type="category"
              width={120}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip content={SafeTooltip} />
            <Bar
              dataKey="solicitados"
              fill="var(--color-solicitados)"
              radius={[0, 6, 6, 0]}
              isAnimationActive
              animationDuration={800}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

// ── Ingresos: evolución mensual ──

const ingresosConfig = {
  ingresos: { label: "Ingresos", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface IngresosLineChartProps {
  data: MonthlyIncomeItem[];
}

export const IngresosLineChart = memo(function IngresosLineChart({ data }: IngresosLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Facturación anual</CardTitle>
        <CardDescription>Evolución mensual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ingresosConfig} className="h-[300px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) =>
                `$${(Number(value) / 1000).toFixed(0)}k`
              }
            />
            <ChartTooltip content={CurrencyTooltip} />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="var(--color-ingresos)"
              strokeWidth={3}
              dot={{ r: 5, fill: "var(--color-ingresos)" }}
              activeDot={{ r: 7 }}
              isAnimationActive
              animationDuration={800}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

// ── Agenda: demanda horaria ──

const agendaConfig = {
  turnos: { label: "Turnos", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface AgendaChartProps {
  data: HourlyDemandItem[];
}

export const AgendaChart = memo(function AgendaChart({ data }: AgendaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Horarios con mayor demanda</CardTitle>
        <CardDescription>Turnos por franja horaria</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={agendaConfig} className="h-[280px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hora" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={SafeTooltip} />
            <Bar
              dataKey="turnos"
              fill="var(--color-turnos)"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={800}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

interface AsistenciaPieChartProps {
  data: AttendanceSlice[];
}

export const AsistenciaPieChart = memo(function AsistenciaPieChart({ data }: AsistenciaPieChartProps) {
  if (data.length === 0) {
    return (
      <StatsEmptyState
        icon={BarChart3}
        title="Sin turnos en el período"
        description="La distribución de turnos aparecerá cuando haya registros en el período seleccionado."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribución de turnos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <ChartContainer config={{}} className="h-[280px] w-full max-w-[400px]">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={3}
                label
                isAnimationActive
                animationDuration={800}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={StringTooltip} />
              <ChartLegend content={SafeLegend} />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
});

// ── Empleados: comparativa facturación ──

const empleadosConfig = {
  ingresos: { label: "Ingresos", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface EmpleadosBarChartProps {
  data: { nombre: string; ingresos: number }[];
}

export const EmpleadosBarChart = memo(function EmpleadosBarChart({ data }: EmpleadosBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comparativa de facturación</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={empleadosConfig} className="h-[260px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="nombre" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) =>
                `$${(Number(value) / 1000).toFixed(0)}k`
              }
            />
            <ChartTooltip content={CurrencyTooltip} />
            <Bar
              dataKey="ingresos"
              fill="var(--color-ingresos)"
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={800}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
