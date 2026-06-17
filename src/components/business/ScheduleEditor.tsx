import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const WEEKEND = ["Sábado", "Domingo"];

export const defaultWeekSchedule: WeekSchedule = Object.fromEntries(
  DAYS.map((d) => [
    d,
    {
      open: d !== "Domingo",
      shifts: [{ start: "09:00", end: "18:00" }],
    } as DaySchedule,
  ])
);

interface Shift {
  start: string;
  end: string;
}

interface DaySchedule {
  open: boolean;
  shifts: Shift[];
}

type WeekSchedule = Record<
  string,
  DaySchedule
>;

const PRESETS: { label: string; description: string; build: () => WeekSchedule }[] = [
  {
    label: "Lun a Vie · 9 a 18",
    description: "Fin de semana cerrado",
    build: () =>
      Object.fromEntries(
        DAYS.map((d) => [
          d,
          {
            open: WEEKDAYS.includes(d),
            shifts: [{ start: "09:00", end: "18:00" }],
          },
        ])
      ) as WeekSchedule,
  },
  {
    label: "Todos los días · 10 a 20",
    description: "Atención corrida",
    build: () =>
      Object.fromEntries(
        DAYS.map((d) => [d, { open: true, shifts: [{ start: "10:00", end: "20:00" }] }])
      ) as WeekSchedule,
  },
  {
    label: "Lun a Sáb · 9-13 y 16-20",
    description: "Turno partido",
    build: () =>
      Object.fromEntries(
        DAYS.map((d) => [
          d,
          {
            open: d !== "Domingo",
            shifts:
              d !== "Domingo"
                ? [
                    { start: "09:00", end: "13:00" },
                    { start: "16:00", end: "20:00" },
                  ]
                : [{ start: "09:00", end: "18:00" }],
          },
        ])
      ) as WeekSchedule,
  },
];

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function validateDay(d: DaySchedule): string | null {
  if (!d.open) return null;
  for (const s of d.shifts) {
    if (toMinutes(s.end) <= toMinutes(s.start)) return "La hora de cierre debe ser mayor a la de apertura";
  }
  if (d.shifts.length === 2) {
    const [a, b] = d.shifts;
    if (toMinutes(b.start) < toMinutes(a.end))
      return "El segundo tramo se solapa con el primero";
  }
  return null;
}

interface Props {
  value: WeekSchedule;
  onChange: (next: WeekSchedule) => void;
}

const ScheduleEditor = ({ value, onChange }: Props) => {
  const updateDay = (day: string, patch: Partial<DaySchedule>) => {
    onChange({ ...value, [day]: { ...value[day], ...patch } });
  };

  const updateShift = (day: string, idx: number, field: "start" | "end", v: string) => {
    const shifts = value[day].shifts.map((s, i) => (i === idx ? { ...s, [field]: v } : s));
    updateDay(day, { shifts });
  };

  const addShift = (day: string) => {
    if (value[day].shifts.length >= 2) return;
    const last = value[day].shifts[value[day].shifts.length - 1];
    updateDay(day, {
      shifts: [...value[day].shifts, { start: last.end, end: "20:00" }],
    });
  };

  const removeShift = (day: string, idx: number) => {
    updateDay(day, { shifts: value[day].shifts.filter((_, i) => i !== idx) });
  };

  const copyTo = (sourceDay: string, targets: string[]) => {
    const src = value[sourceDay];
    const next = { ...value };
    targets.forEach((t) => {
      if (t === sourceDay) return;
      next[t] = { open: src.open, shifts: src.shifts.map((s) => ({ ...s })) };
    });
    onChange(next);
  };

  const setAllOpen = (open: boolean) => {
    const next: WeekSchedule = Object.fromEntries(
      DAYS.map((d) => [d, { ...value[d], open }])
    ) as WeekSchedule;
    onChange(next);
  };

  const summary = useMemo(() => {
    let openDays = 0;
    let totalMinutes = 0;
    DAYS.forEach((d) => {
      const day = value[d];
      if (!day?.open) return;
      openDays += 1;
      day.shifts.forEach((s) => {
        const diff = toMinutes(s.end) - toMinutes(s.start);
        if (diff > 0) totalMinutes += diff;
      });
    });
    return { openDays, hours: Math.round((totalMinutes / 60) * 10) / 10 };
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Sparkles size={14} className="mr-2" />
              Aplicar preset
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            {PRESETS.map((p) => (
              <DropdownMenuItem
                key={p.label}
                onClick={() => onChange(p.build())}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={() => copyTo("Lunes", DAYS)}>
          <Copy size={14} className="mr-2" />
          Copiar Lunes a toda la semana
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setAllOpen(true)}>
            Abrir todos
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAllOpen(false)}>
            Cerrar todos
          </Button>
        </div>
      </div>

      {/* Day list */}
      <div className="space-y-2">
        {DAYS.map((day) => {
          const d = value[day];
          if (!d) return null;
          const error = validateDay(d);
          return (
            <Card
              key={day}
              className={cn(
                "transition-all duration-200",
                d.open ? "border-primary/30" : "bg-muted/40 border-border"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      d.open ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "w-24 text-sm font-medium",
                      d.open ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {day}
                  </span>

                  <Switch
                    checked={d.open}
                    onCheckedChange={(v) => updateDay(day, { open: v })}
                    aria-label={`${d.open ? "Cerrar" : "Abrir"} ${day}`}
                  />

                  {!d.open && (
                    <span className="text-sm text-muted-foreground">Cerrado</span>
                  )}

                  <div className="ml-auto flex items-center gap-1">
                    {d.open && d.shifts.length < 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addShift(day)}
                        className="text-primary hover:text-primary"
                      >
                        <Plus size={14} className="mr-1" />
                        Agregar pausa
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyTo(day, DAYS)}>
                          Copiar a todos los días
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyTo(day, WEEKDAYS)}>
                          Copiar a días hábiles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyTo(day, WEEKEND)}>
                          Copiar al fin de semana
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            updateDay(day, {
                              open: false,
                              shifts: [{ start: "09:00", end: "18:00" }],
                            })
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          Marcar como cerrado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {d.open && (
                  <div className="mt-3 space-y-2 pl-[22px]">
                    {d.shifts.map((s, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <Input
                          type="time"
                          className="w-28"
                          value={s.start}
                          onChange={(e) => updateShift(day, i, "start", e.target.value)}
                        />
                        <span className="text-sm text-muted-foreground">a</span>
                        <Input
                          type="time"
                          className="w-28"
                          value={s.end}
                          onChange={(e) => updateShift(day, i, "end", e.target.value)}
                        />
                        {d.shifts.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeShift(day, i)}
                            aria-label="Quitar tramo"
                          >
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        )}
                        {i === 0 && d.shifts.length === 2 && (
                          <Badge variant="secondary" className="ml-1">
                            Mañana
                          </Badge>
                        )}
                        {i === 1 && (
                          <Badge variant="secondary" className="ml-1">
                            Tarde
                          </Badge>
                        )}
                      </div>
                    ))}
                    {error && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle size={12} />
                        {error}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-3 p-4">
          <CalendarCheck size={18} className="text-primary" />
          <p className="text-sm text-foreground">
            Atendés <span className="font-semibold">{summary.openDays}</span>{" "}
            {summary.openDays === 1 ? "día" : "días"} de la semana ·{" "}
            <span className="font-semibold">{summary.hours} hs</span> semanales
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleEditor;
