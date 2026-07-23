import type { ApiHorario } from "@/types/api";
import { WEEK_DAYS, apiDayToWeekDayIndex } from "@/lib/schedule-utils";

interface HorarioCardProps {
  horarios: ApiHorario[];
}

function formatHour(val: string): string {
  return val.slice(0, 5);
}

export default function HorarioCard({ horarios }: HorarioCardProps) {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Horarios de Atención</h3>

      <div className="space-y-2 text-sm">
        {WEEK_DAYS.map((dayName, idx) => {
          const slots = horarios.filter(
            (h) => apiDayToWeekDayIndex(h.dia_semana) === idx,
          ).sort((a, b) => a.hora_apertura.localeCompare(b.hora_apertura));

          const isToday = idx === todayIndex;

          return (
            <div
              key={dayName}
              className={`flex justify-between rounded-lg px-2 py-1 ${isToday ? "bg-primary/5 font-medium" : ""}`}
            >
              <span className={isToday ? "text-primary" : slots.length > 0 ? "text-foreground" : "text-muted-foreground/50"}>
                {dayName}
                {isToday && (
                  <span className="ml-2 text-xs font-normal text-primary">(hoy)</span>
                )}
              </span>
              <span className="text-right text-muted-foreground">
                {slots.length === 0 ? (
                  <span className="text-muted-foreground/50">Cerrado</span>
                ) : (
                  slots.map((s, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1 text-muted-foreground/40">/</span>}
                      {formatHour(s.hora_apertura)}–{formatHour(s.hora_cierre)}
                    </span>
                  ))
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
