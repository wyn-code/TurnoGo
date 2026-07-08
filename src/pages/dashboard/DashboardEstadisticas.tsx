import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CalendarCheck,
  Clock,
  Award,
  Download,
  Crown,
  Star,
  Activity,
  UserCheck,
  UserX,
  Repeat,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useStatistics } from "@/hooks/useEstadistica";
import { useDashboardBusiness } from "@/contexts/DashboardBusinessContext";
import { exportStatisticsFile } from "@/lib/statistics-utils";
import type { MetricWithDelta, StatisticsCompare, StatisticsRange } from "@/types/statistics";

const COLORS = [
  "hsl(var(--primary))",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
];

const formatCurrency = (value: number) => `$${value.toLocaleString("es-AR")}`;

const formatMetricValue = (value: number, asCurrency = false) =>
  asCurrency ? formatCurrency(value) : value.toLocaleString("es-AR");

const KpiCard = ({
  icon: Icon,
  label,
  value,
  delta,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
}) => (
  <Card className="transition-shadow hover:shadow-card">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {delta ? (
            <div
              className={`mt-1 flex items-center gap-1 text-xs ${
                trend === "up" ? "text-green-600" : "text-destructive"
              }`}
            >
              {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{delta}</span>
            </div>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MetricCard = ({
  icon,
  label,
  metric,
  asCurrency = false,
}: {
  icon: LucideIcon;
  label: string;
  metric: MetricWithDelta;
  asCurrency?: boolean;
}) => (
  <KpiCard
    icon={icon}
    label={label}
    value={formatMetricValue(metric.value, asCurrency)}
    delta={metric.delta ? `${metric.delta} vs período anterior` : undefined}
    trend={metric.trend}
  />
);

const DashboardEstadisticas = () => {
  const [rango, setRango] = useState<StatisticsRange>("mes");
  const [comparar, setComparar] = useState<StatisticsCompare>("anterior");
  const { business, isLoadingBusiness } = useDashboardBusiness();

  const {
    data: statistics,
    isLoading,
    error,
  } = useStatistics(business?.id_negocio, rango, comparar);

  const handleExport = (format: "excel" | "csv") => {
    if (!statistics) {
      toast.error("No hay estadísticas para exportar");
      return;
    }

    exportStatisticsFile(statistics, format);
    toast.success(`Estadísticas exportadas a ${format.toUpperCase()}`);
  };

  if (isLoadingBusiness || isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business?.id_negocio) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No encontramos un negocio vinculado a tu usuario.
        </p>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-destructive">
          No se pudieron cargar las estadísticas del negocio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Estadísticas</h2>
            <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Crown size={12} className="mr-1" /> Premium
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Información clave sobre el rendimiento de {business.nombre}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={rango} onValueChange={(value) => setRango(value as StatisticsRange)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
              <SelectItem value="anio">Este año</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={comparar}
            onValueChange={(value) => setComparar(value as StatisticsCompare)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anterior">vs período anterior</SelectItem>
              <SelectItem value="anio">vs año anterior</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
            <Download size={14} className="mr-1" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download size={14} className="mr-1" /> CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          icon={DollarSign}
          label="Ingreso total"
          metric={statistics.kpis.ingresoTotal}
          asCurrency
        />
        <MetricCard
          icon={Users}
          label="Clientes activos"
          metric={statistics.kpis.clientesActivos}
        />
        <KpiCard
          icon={Award}
          label="Servicio más vendido"
          value={statistics.kpis.servicioMasVendido}
        />
        <KpiCard
          icon={CalendarCheck}
          label="Día más facturado"
          value={statistics.kpis.diaMasFacturado}
        />
        <KpiCard
          icon={Clock}
          label="Hora de mayor demanda"
          value={statistics.kpis.horaMayorDemanda}
        />
        <KpiCard
          icon={Activity}
          label="Ocupación de agenda"
          value={`${statistics.kpis.ocupacionAgenda.value}%`}
          delta={
            statistics.kpis.ocupacionAgenda.delta
              ? `${statistics.kpis.ocupacionAgenda.delta} vs período anterior`
              : undefined
          }
          trend={statistics.kpis.ocupacionAgenda.trend}
        />
      </div>

      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard icon={CalendarCheck} label="Turnos hoy" metric={statistics.resumen.turnosHoy} />
            <MetricCard icon={CalendarCheck} label="Turnos esta semana" metric={statistics.resumen.turnosSemana} />
            <MetricCard icon={CalendarCheck} label="Turnos este mes" metric={statistics.resumen.turnosMes} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comparación con período anterior</CardTitle>
              <CardDescription>Turnos diarios actuales vs período previo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.resumen.turnosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="hsl(var(--primary))" name="Período actual" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="anterior" fill="#cbd5e1" name="Período anterior" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard icon={UserCheck} label="Clientes nuevos" metric={statistics.clientes.nuevos} />
            <MetricCard icon={Repeat} label="Clientes recurrentes" metric={statistics.clientes.recurrentes} />
            <MetricCard icon={UserX} label="Clientes inactivos" metric={statistics.clientes.inactivos} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star size={18} className="text-primary" /> Clientes con más visitas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statistics.clientes.topVisitas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay visitas registradas en el período.</p>
                ) : (
                  statistics.clientes.topVisitas.map((cliente) => (
                    <div
                      key={cliente.nombre}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <p className="font-medium text-foreground">{cliente.nombre}</p>
                      <Badge variant="secondary">{cliente.visitas} visitas</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle size={18} className="text-destructive" /> Más cancelaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statistics.clientes.topCancelaciones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay cancelaciones en el período.</p>
                ) : (
                  statistics.clientes.topCancelaciones.map((cliente) => (
                    <div
                      key={cliente.nombre}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <p className="font-medium text-foreground">{cliente.nombre}</p>
                      <Badge className="bg-destructive/10 text-destructive" variant="secondary">
                        {cliente.cancelaciones} cancelaciones
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servicios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servicios más solicitados</CardTitle>
            </CardHeader>
            <CardContent>
              {statistics.servicios.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay servicios con turnos en el período.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.servicios.items} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="nombre" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="solicitados" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingresos y tiempo por servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Servicio</th>
                      <th className="py-2">Solicitudes</th>
                      <th className="py-2">Ingresos</th>
                      <th className="py-2">Tiempo prom.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.servicios.items.map((service) => (
                      <tr key={service.nombre} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium text-foreground">{service.nombre}</td>
                        <td className="py-3">{service.solicitados}</td>
                        <td className="py-3">{formatCurrency(service.ingresos)}</td>
                        <td className="py-3">{service.tiempo} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {statistics.servicios.menosSolicitado ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Servicio menos solicitado:{" "}
                  <span className="font-medium text-foreground">
                    {statistics.servicios.menosSolicitado}
                  </span>
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingresos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={DollarSign} label="Facturación diaria" metric={statistics.ingresos.facturacionDiaria} asCurrency />
            <MetricCard icon={DollarSign} label="Facturación semanal" metric={statistics.ingresos.facturacionSemanal} asCurrency />
            <MetricCard icon={DollarSign} label="Facturación mensual" metric={statistics.ingresos.facturacionMensual} asCurrency />
            <MetricCard icon={DollarSign} label="Ticket promedio" metric={statistics.ingresos.ticketPromedio} asCurrency />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Facturación anual</CardTitle>
              <CardDescription>Evolución mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.ingresos.evolucionMensual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                    formatter={(value) =>
                      typeof value === "number" ? formatCurrency(value) : String(value)
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horarios con mayor demanda</CardTitle>
              <CardDescription>Turnos por franja horaria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statistics.agenda.horariosDemanda}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hora" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="turnos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Horario pico</p>
                  <p className="font-semibold text-foreground">{statistics.agenda.horarioPico}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Día con más turnos</p>
                  <p className="font-semibold text-foreground">{statistics.agenda.diaMasTurnos}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Menor ocupación</p>
                  <p className="font-semibold text-foreground">{statistics.agenda.menorOcupacion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Porcentaje de ocupación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agenda ocupada</span>
                <span className="font-semibold text-foreground">
                  {statistics.agenda.ocupacionPorcentaje}%
                </span>
              </div>
              <Progress value={statistics.agenda.ocupacionPorcentaje} className="h-3" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asistencia" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard icon={CalendarCheck} label="Completados" value={String(statistics.asistencia.completados)} />
            <KpiCard icon={UserX} label="Cancelados" value={String(statistics.asistencia.cancelados)} />
            <KpiCard icon={Repeat} label="Reprogramados" value={String(statistics.asistencia.reprogramados)} />
            <KpiCard icon={AlertCircle} label="No show" value={String(statistics.asistencia.noShow)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribución de turnos</CardTitle>
              </CardHeader>
              <CardContent>
                {statistics.asistencia.distribucion.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay turnos en el período seleccionado.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statistics.asistencia.distribucion}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {statistics.asistencia.distribucion.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasa de asistencia</CardTitle>
                <CardDescription>
                  Sobre {statistics.asistencia.totalTurnos} turnos del período
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="py-6 text-center">
                  <p className="text-5xl font-bold text-primary">
                    {statistics.asistencia.tasaAsistencia}%
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    de los clientes asistieron
                  </p>
                </div>
                <Progress value={statistics.asistencia.tasaAsistencia} className="h-3" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-4">
          {statistics.empleados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No hay empleados activos con turnos en el período seleccionado.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {statistics.empleados.map((employee) => (
                  <Card key={employee.nombre} className="transition-shadow hover:shadow-card">
                    <CardHeader>
                      <CardTitle className="text-base">{employee.nombre}</CardTitle>
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
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparativa de facturación</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statistics.empleados}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="nombre" stroke="hsl(var(--muted-foreground))" />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                        }}
                        formatter={(value) =>
                          typeof value === "number" ? formatCurrency(value) : String(value)
                        }
                      />
                      <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardEstadisticas;
