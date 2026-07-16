import type { ApiHorario } from "@/types/api";
import { WEEK_DAYS, apiDayToWeekDayIndex } from "@/lib/schedule-utils";

interface HorarioCardProps {
  horarios: ApiHorario[];
}

export default function HorarioCard({ horarios }: HorarioCardProps) {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Horarios de Atención</h3>

      <div className="space-y-2 text-sm">
        {WEEK_DAYS.map((dayName, idx) => {
          const horario = horarios.find(
            (h) => apiDayToWeekDayIndex(h.dia_semana) === idx,
          );
          const isToday = idx === todayIndex;

          return (
            <div
              key={dayName}
              className={`flex justify-between rounded-lg px-2 py-1 ${isToday ? "bg-primary/5 font-medium" : ""}`}
            >
              <span className={isToday ? "text-primary" : horario ? "text-foreground" : "text-muted-foreground/50"}>
                {dayName}
                {isToday && (
                  <span className="ml-2 text-xs font-normal text-primary">(hoy)</span>
                )}
              </span>
              <span className={horario ? "text-muted-foreground" : "text-muted-foreground/50"}>
                {horario
                  ? `${horario.hora_apertura.slice(0, 5)} – ${horario.hora_cierre.slice(0, 5)}`
                  : "Cerrado"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
